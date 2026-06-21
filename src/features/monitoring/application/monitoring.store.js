import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MonitoringApiService } from '../infrastructure/services/monitoring-api.service.js';
import { MonitoringAssembler }  from '../infrastructure/assembler/monitoring.assembler.js';

const monitoringApi = new MonitoringApiService();

/**
 * useMonitoringStore — Estado global del módulo Service Operation & Monitoring.
 *
 * Expone:
 *  - Estado para el servicio activo del cliente/empresa.
 *  - Lista de la agenda diaria del técnico.
 *  - Telemetría IoT del servicio activo.
 *  - Historial de servicios completados.
 *  - Acciones para todas las operaciones de campo.
 */
export const useMonitoringStore = defineStore('monitoring', () => {

    // ─── State ────────────────────────────────────────────────────────────────

    /** @type {import('vue').Ref<import('../domain/models/service-order.entity.js').ServiceOrder|null>} */
    const activeServiceOrder   = ref(null);

    /** @type {import('vue').Ref<import('../domain/models/service-order.entity.js').ServiceOrder[]>} */
    const technicianDayList    = ref([]);

    /** @type {import('vue').Ref<import('../domain/models/service-order.entity.js').ServiceOrder[]>} */
    const serviceHistory       = ref([]);

    /** @type {import('vue').Ref<import('../domain/models/telemetry-log.entity.js').TelemetryLog|null>} */
    const telemetry            = ref(null);

    /** @type {import('vue').Ref<import('../infrastructure/resources/telemetry.resource.js').RelayStatusResource[]>} */
    const relayCommands        = ref([]);

    const isLoading            = ref(false);
    const isActionLoading      = ref(false);
    const errors               = ref([]);

    // ─── Computed ─────────────────────────────────────────────────────────────

    const hasActiveService     = computed(() => !!activeServiceOrder.value);
    const hasIotAnomalies      = computed(() => telemetry.value?.hasAnomalies ?? false);
    const iotAnomalies         = computed(() => telemetry.value?.anomalies ?? []);

    /** KPIs para el técnico: servicios del día por estado */
    const dayKpis = computed(() => {
        const list = technicianDayList.value;
        return {
            total:      list.length,
            scheduled:  list.filter(s => s.isScheduled).length,
            inProgress: list.filter(s => s.isInProgress).length,
            completed:  list.filter(s => s.isCompleted).length,
        };
    });

    // ─── Actions ──────────────────────────────────────────────────────────────

    /**
     * Carga el servicio activo de un cliente/empresa.
     * @param {string} clientId
     */
    async function loadClientActiveService(clientId) {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = await monitoringApi.getClientActiveExecution(clientId);
            const resource = MonitoringAssembler.toServiceOrderResourceFromResponse(response);
            activeServiceOrder.value = MonitoringAssembler.toServiceOrderEntityFromResource(resource);
        } catch (error) {
            _handleError('loadClientActiveService', error);
            activeServiceOrder.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Carga la agenda de servicios del técnico para el día.
     * @param {string} technicianId
     */
    async function loadTechnicianDayList(technicianId) {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = await monitoringApi.getTechnicianAssigned(technicianId);
            technicianDayList.value = MonitoringAssembler.toServiceOrderListFromResponse(response);
        } catch (error) {
            _handleError('loadTechnicianDayList', error);
            technicianDayList.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Carga el historial de servicios.
     * @param {'client'|'technician'} entityType
     * @param {string} entityId
     */
    async function loadServiceHistory(entityType, entityId) {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = entityType === 'technician'
                ? await monitoringApi.getTechnicianHistory(entityId)
                : await monitoringApi.getClientHistory(entityId);
            serviceHistory.value = MonitoringAssembler.toServiceOrderListFromResponse(response);
        } catch (error) {
            _handleError('loadServiceHistory', error);
            serviceHistory.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Carga el contexto IoT (snapshot de telemetría) de una ejecución.
     * @param {string} executionId
     */
    async function loadIotContext(executionId) {
        try {
            const response = await monitoringApi.getIotContext(executionId);
            telemetry.value = MonitoringAssembler.toTelemetryEntityFromResponse(response);
        } catch (error) {
            _handleError('loadIotContext', error);
            telemetry.value = null;
        }
    }

    /**
     * Carga el estado actual de los comandos de relé.
     * @param {string} executionId
     */
    async function loadRelayStatus(executionId) {
        try {
            const response = await monitoringApi.getRelayStatus(executionId);
            relayCommands.value = MonitoringAssembler.toRelayStatusListFromResponse(response);
        } catch (error) {
            _handleError('loadRelayStatus', error);
        }
    }

    /**
     * Inicia formalmente el servicio (campo: técnico).
     * @param {string} executionId
     * @returns {boolean}
     */
    async function startService(executionId) {
        isActionLoading.value = true;
        try {
            const { StartServiceCommand } = await import('../domain/commands/start-service.command.js');
            const command = new StartServiceCommand(executionId);
            await monitoringApi.startExecution(executionId, command.toPayload());
            // Actualizar el servicio activo localmente
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status      = 'InProgress';
                activeServiceOrder.value.startedAt   = new Date();
                activeServiceOrder.value.currentStep = 1;
            }
            return true;
        } catch (error) {
            _handleError('startService', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Acciona el relé de forma remota (IoT).
     * @param {string} executionId
     * @param {'On'|'Off'} state
     * @param {string} reason
     * @returns {boolean}
     */
    async function toggleRelay(executionId, state, reason = '') {
        isActionLoading.value = true;
        try {
            await monitoringApi.toggleRelay(executionId, {
                relayState:  state,
                reason:      reason,
                requestedAt: new Date().toISOString(),
            });
            await loadRelayStatus(executionId);
            return true;
        } catch (error) {
            _handleError('toggleRelay', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Actualiza el informe técnico.
     * @param {string} executionId
     * @param {{ reportContent: string, findings: string, recommendations: string, iotFindings: string }} reportData
     * @returns {boolean}
     */
    async function updateReport(executionId, reportData) {
        isActionLoading.value = true;
        try {
            await monitoringApi.updateReport(executionId, {
                ...reportData,
                updatedAt: new Date().toISOString(),
            });
            if (activeServiceOrder.value?.executionId === executionId) {
                Object.assign(activeServiceOrder.value, reportData);
                activeServiceOrder.value.currentStep = Math.max(activeServiceOrder.value.currentStep, 2);
            }
            return true;
        } catch (error) {
            _handleError('updateReport', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Completa y cierra la orden (irreversible).
     * @param {string} executionId
     * @param {object} reportData
     * @returns {boolean}
     */
    async function completeService(executionId, reportData) {
        isActionLoading.value = true;
        try {
            // 1. Guardar informe primero
            await monitoringApi.updateReport(executionId, {
                ...reportData,
                updatedAt: new Date().toISOString(),
            });
            // 2. Cerrar la ejecución
            await monitoringApi.completeExecution(executionId);
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status      = 'Completed';
                activeServiceOrder.value.completedAt = new Date();
                activeServiceOrder.value.currentStep = 4;
            }
            return true;
        } catch (error) {
            _handleError('completeService', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Cancela el servicio.
     * @param {string} executionId
     * @param {{ cancelledBy: 'Client'|'Technician', reason: string, notes: string, requestReassignment: boolean }} payload
     * @returns {boolean}
     */
    async function cancelService(executionId, payload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.cancelExecution(executionId, payload);
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status      = 'Cancelled';
                activeServiceOrder.value.cancelledAt = new Date();
                activeServiceOrder.value.cancelReason = payload.reason;
            }
            return true;
        } catch (error) {
            _handleError('cancelService', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * El cliente extiende el tiempo de espera.
     * @param {string} executionId
     * @param {number} minutes
     * @returns {boolean}
     */
    async function extendWait(executionId, minutes) {
        isActionLoading.value = true;
        try {
            await monitoringApi.extendWait(executionId, { extendMinutes: minutes });
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.waitExtensionMinutes += minutes;
            }
            return true;
        } catch (error) {
            _handleError('extendWait', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Envía la reseña del cliente.
     * @param {string} executionId
     * @param {object} reviewPayload
     * @returns {boolean}
     */
    async function submitClientReview(executionId, reviewPayload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.submitClientReview(executionId, reviewPayload);
            return true;
        } catch (error) {
            _handleError('submitClientReview', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /**
     * Envía la reseña del técnico.
     * @param {string} executionId
     * @param {object} reviewPayload
     * @returns {boolean}
     */
    async function submitTechnicianReview(executionId, reviewPayload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.submitTechnicianReview(executionId, reviewPayload);
            return true;
        } catch (error) {
            _handleError('submitTechnicianReview', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    /** Limpia el estado del store. */
    function $reset() {
        activeServiceOrder.value = null;
        technicianDayList.value  = [];
        serviceHistory.value     = [];
        telemetry.value          = null;
        relayCommands.value      = [];
        errors.value             = [];
        isLoading.value          = false;
        isActionLoading.value    = false;
    }

    // ─── Private helpers ──────────────────────────────────────────────────────

    function _handleError(action, error) {
        const msg = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
        const status = error?.response?.status ?? null;
        console.error(`[MonitoringStore] ${action} failed${status ? ` (HTTP ${status})` : ''}: ${msg}`);
        errors.value = [{ action, status, message: msg }];
    }

    // ─── Expose ───────────────────────────────────────────────────────────────

    return {
        // State
        activeServiceOrder,
        technicianDayList,
        serviceHistory,
        telemetry,
        relayCommands,
        isLoading,
        isActionLoading,
        errors,
        // Computed
        hasActiveService,
        hasIotAnomalies,
        iotAnomalies,
        dayKpis,
        // Actions
        loadClientActiveService,
        loadTechnicianDayList,
        loadServiceHistory,
        loadIotContext,
        loadRelayStatus,
        startService,
        toggleRelay,
        updateReport,
        completeService,
        cancelService,
        extendWait,
        submitClientReview,
        submitTechnicianReview,
        $reset,
    };
});

export default useMonitoringStore;
