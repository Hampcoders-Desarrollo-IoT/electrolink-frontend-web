import { BaseApi }      from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const BASE = '/service-executions';

/**
 * MonitoringApiService — Cliente Axios configurado con todos los endpoints
 * del módulo "Service Operation & Monitoring" del backend de Hampcoders.
 */
export class MonitoringApiService extends BaseApi {
    constructor() {
        super();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONSULTAS GENERALES
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * GET /api/v1/service-executions/{executionId}
     * Obtiene los detalles principales de una ejecución específica.
     */
    getExecution(executionId) {
        return this.http.get(`${BASE}/${executionId}`);
    }

    /**
     * GET /api/v1/service-executions/{executionId}/work-log
     * Fotos, reporte técnico e historial de componentes/relés.
     */
    getWorkLog(executionId) {
        return this.http.get(`${BASE}/${executionId}/work-log`);
    }

    /**
     * GET /api/v1/service-executions/technicians/{technicianId}/assigned
     * Agenda de servicios activos/programados del técnico.
     */
    getTechnicianAssigned(technicianId) {
        return this.http.get(`${BASE}/technicians/${technicianId}/assigned`);
    }

    /**
     * GET /api/v1/service-executions/clients/{clientId}/active
     * Servicio activo del propietario o empresa actual.
     */
    getClientActiveExecution(clientId) {
        return this.http.get(`${BASE}/clients/${clientId}/active`);
    }

    /**
     * GET /api/v1/service-executions/clients/{clientId}/history
     * Historial de servicios finalizados/cancelados del cliente.
     */
    getClientHistory(clientId) {
        return this.http.get(`${BASE}/clients/${clientId}/history`);
    }

    /**
     * GET /api/v1/service-executions/technicians/{technicianId}/history
     * Historial de servicios cerrados por el técnico.
     */
    getTechnicianHistory(technicianId) {
        return this.http.get(`${BASE}/technicians/${technicianId}/history`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CAPACIDADES E INTEGRACIÓN IoT
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * GET /api/v1/service-executions/{executionId}/iot-context
     * Snapshot inmutable de los sensores capturados al inicio.
     */
    getIotContext(executionId) {
        return this.http.get(`${BASE}/${executionId}/iot-context`);
    }

    /**
     * GET /api/v1/service-executions/{executionId}/relay-status
     * Listado de comandos de relé (Pending, Executed, Failed).
     */
    getRelayStatus(executionId) {
        return this.http.get(`${BASE}/${executionId}/relay-status`);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/relay/toggle
     * Acciona el interruptor de energía de forma remota.
     * @param {string} executionId
     * @param {{ relayState: 'On'|'Off', reason: string, requestedAt: string }} payload
     */
    toggleRelay(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/relay/toggle`, payload);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ACCIONES OPERATIVAS DE CAMPO (COMANDOS DEL TÉCNICO)
    // ═══════════════════════════════════════════════════════════════════════

    /**
     * POST /api/v1/service-executions/{executionId}/start
     * Inicia formalmente el servicio en el sitio.
     * @param {string} executionId
     * @param {{ startedAt: string }} payload
     */
    startExecution(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/start`, payload);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/photos
     * Sube evidencias fotográficas.
     * @param {string} executionId
     * @param {{ photoType: 'Before'|'During'|'After', photoUrl: string, takenAt: string, notes: string }} payload
     */
    uploadPhoto(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/photos`, payload);
    }

    /**
     * PUT /api/v1/service-executions/{executionId}/components
     * Registra materiales utilizados.
     * @param {string} executionId
     * @param {{ componentsUsed: Array, recordedAt: string }} payload
     */
    updateComponents(executionId, payload) {
        return this.http.put(`${BASE}/${executionId}/components`, payload);
    }

    /**
     * PUT /api/v1/service-executions/{executionId}/report
     * Actualiza el informe técnico.
     * @param {string} executionId
     * @param {{ reportContent: string, findings: string, recommendations: string, iotFindings: string, updatedAt: string }} payload
     */
    updateReport(executionId, payload) {
        return this.http.put(`${BASE}/${executionId}/report`, payload);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/complete
     * Cierra y finaliza la orden de trabajo (irreversible).
     */
    completeExecution(executionId) {
        return this.http.post(`${BASE}/${executionId}/complete`, {});
    }

    /**
     * POST /api/v1/service-executions/{executionId}/cancel
     * Cancela el servicio antes de completarlo.
     * @param {string} executionId
     * @param {{ cancelledBy: 'Client'|'Technician', reason: string, notes: string, requestReassignment: boolean }} payload
     */
    cancelExecution(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/cancel`, payload);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/extend-wait
     * El cliente extiende el tiempo de espera ante un retraso.
     * @param {string} executionId
     * @param {{ extendMinutes: number }} payload
     */
    extendWait(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/extend-wait`, payload);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/reviews/client
     * Envía la reseña del cliente sobre el técnico.
     * @param {string} executionId
     * @param {object} payload
     */
    submitClientReview(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/reviews/client`, payload);
    }

    /**
     * POST /api/v1/service-executions/{executionId}/reviews/technician
     * Envía la reseña del técnico sobre el cliente.
     * @param {string} executionId
     * @param {object} payload
     */
    submitTechnicianReview(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/reviews/technician`, payload);
    }
}
