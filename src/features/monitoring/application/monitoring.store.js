import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MonitoringApiService } from '../infrastructure/services/monitoring-api.service.js';
import { MonitoringAssembler }  from '../infrastructure/assembler/monitoring.assembler.js';

const monitoringApi = new MonitoringApiService();

export const useMonitoringStore = defineStore('monitoring', () => {

    const activeServiceOrder   = ref(null);
    const technicianDayList    = ref([]);
    const serviceHistory       = ref([]);
    const telemetry            = ref(null);
    const relayCommands        = ref([]);

    const isLoading            = ref(false);
    const isActionLoading      = ref(false);
    const errors               = ref([]);

    const hasActiveService     = computed(() => !!activeServiceOrder.value);
    const hasIotAnomalies      = computed(() => telemetry.value?.hasAnomalies ?? false);
    const iotAnomalies         = computed(() => telemetry.value?.anomalies ?? []);

    const dayKpis = computed(() => {
        const list = technicianDayList.value;
        return {
            total:      list.length,
            scheduled:  list.filter(s => s.isScheduled || s.isEnRoute || s.isArrived).length,
            inProgress: list.filter(s => s.isInProgress || s.isPendingReview).length,
            completed:  list.filter(s => s.isCompleted).length,
        };
    });

    async function loadClientActiveService(homeownerId) {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = await monitoringApi.getHomeownerActiveExecution(homeownerId);
            const resource = MonitoringAssembler.toServiceOrderResourceFromResponse(response);
            activeServiceOrder.value = MonitoringAssembler.toServiceOrderEntityFromResource(resource);
        } catch (error) {
            _handleError('loadClientActiveService', error);
            activeServiceOrder.value = null;
        } finally {
            isLoading.value = false;
        }
    }

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

    async function loadServiceHistory(entityType, entityId) {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = entityType === 'technician'
                ? await monitoringApi.getTechnicianHistory(entityId)
                : await monitoringApi.getHomeownerHistory(entityId);
            serviceHistory.value = MonitoringAssembler.toServiceOrderListFromResponse(response);
        } catch (error) {
            _handleError('loadServiceHistory', error);
            serviceHistory.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    async function loadIotContext(executionId) {
        try {
            const response = await monitoringApi.getIotContext(executionId);
            telemetry.value = MonitoringAssembler.toTelemetryEntityFromResponse(response);
        } catch (error) {
            _handleError('loadIotContext', error);
            telemetry.value = null;
        }
    }

    async function loadRelayStatus(executionId) {
        try {
            const response = await monitoringApi.getRelayStatus(executionId);
            relayCommands.value = MonitoringAssembler.toRelayStatusListFromResponse(response);
        } catch (error) {
            _handleError('loadRelayStatus', error);
        }
    }

    async function startService(executionId) {
        isActionLoading.value = true;
        try {
            const { StartServiceCommand } = await import('../domain/commands/start-service.command.js');
            const command = new StartServiceCommand(executionId);
            await monitoringApi.startExecution(executionId, command.toPayload());
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status    = 'EnRoute';
                activeServiceOrder.value.startedAt = new Date();
            }
            return true;
        } catch (error) {
            _handleError('startService', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    async function uploadPhoto(executionId, payload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.uploadPhoto(executionId, payload);
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.photosCount += 1;
            }
            return true;
        } catch (error) {
            _handleError('uploadPhoto', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    async function updateComponents(executionId, payload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.updateComponents(executionId, payload);
            return true;
        } catch (error) {
            _handleError('updateComponents', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    async function updateReport(executionId, reportData) {
        isActionLoading.value = true;
        try {
            await monitoringApi.updateReport(executionId, {
                ...reportData,
                updatedAt: new Date().toISOString(),
            });
            if (activeServiceOrder.value?.executionId === executionId) {
                Object.assign(activeServiceOrder.value, reportData);
            }
            return true;
        } catch (error) {
            _handleError('updateReport', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

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

    async function completeService(executionId) {
        isActionLoading.value = true;
        try {
            await monitoringApi.completeExecution(executionId);
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status      = 'Completed';
                activeServiceOrder.value.completedAt = new Date();
            }
            return true;
        } catch (error) {
            _handleError('completeService', error);
            return false;
        } finally {
            isActionLoading.value = false;
        }
    }

    async function cancelService(executionId, payload) {
        isActionLoading.value = true;
        try {
            await monitoringApi.cancelExecution(executionId, payload);
            if (activeServiceOrder.value?.executionId === executionId) {
                activeServiceOrder.value.status       = 'Cancelled';
                activeServiceOrder.value.cancelledAt  = new Date();
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

    function _handleError(action, error) {
        const msg = error?.response?.data?.message ?? error?.message ?? 'Unknown error';
        const status = error?.response?.status ?? null;
        console.error(`[MonitoringStore] ${action} failed${status ? ` (HTTP ${status})` : ''}: ${msg}`);
        errors.value = [{ action, status, message: msg }];
    }

    return {
        activeServiceOrder,
        technicianDayList,
        serviceHistory,
        telemetry,
        relayCommands,
        isLoading,
        isActionLoading,
        errors,
        hasActiveService,
        hasIotAnomalies,
        iotAnomalies,
        dayKpis,
        loadClientActiveService,
        loadTechnicianDayList,
        loadServiceHistory,
        loadIotContext,
        loadRelayStatus,
        startService,
        uploadPhoto,
        updateComponents,
        updateReport,
        toggleRelay,
        completeService,
        cancelService,
        extendWait,
        submitClientReview,
        submitTechnicianReview,
        $reset,
    };
});

export default useMonitoringStore;
