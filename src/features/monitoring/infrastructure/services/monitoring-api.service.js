import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

const BASE = '/service-executions';

export class MonitoringApiService extends BaseApi {
    constructor() {
        super();
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CONSULTAS
    // ═══════════════════════════════════════════════════════════════════════

    getExecution(executionId) {
        return this.http.get(`${BASE}/${executionId}`);
    }

    getTechnicianAssigned(technicianId) {
        return this.http.get(`${BASE}/technicians/${technicianId}/assigned`);
    }

    getHomeownerActiveExecution(homeownerId) {
        return this.http.get(`${BASE}/homeowners/${homeownerId}/active`);
    }

    getHomeownerHistory(homeownerId) {
        return this.http.get(`${BASE}/homeowners/${homeownerId}/history`);
    }

    getTechnicianHistory(technicianId) {
        return this.http.get(`${BASE}/technicians/${technicianId}/history`);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // CAPACIDADES E INTEGRACIÓN IoT
    // ═══════════════════════════════════════════════════════════════════════

    getIotContext(executionId) {
        return this.http.get(`${BASE}/${executionId}/iot-context`);
    }

    getRelayStatus(executionId) {
        return this.http.get(`${BASE}/${executionId}/relay-status`);
    }

    toggleRelay(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/relay/toggle`, payload);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // ACCIONES OPERATIVAS DE CAMPO
    // ═══════════════════════════════════════════════════════════════════════

    startExecution(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/start`, payload);
    }

    uploadPhoto(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/photos`, payload);
    }

    updateComponents(executionId, payload) {
        return this.http.put(`${BASE}/${executionId}/components`, payload);
    }

    updateReport(executionId, payload) {
        return this.http.put(`${BASE}/${executionId}/report`, payload);
    }

    completeExecution(executionId) {
        return this.http.post(`${BASE}/${executionId}/complete`);
    }

    cancelExecution(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/cancel`, payload);
    }

    extendWait(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/extend-wait`, payload);
    }

    submitClientReview(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/reviews/client`, payload);
    }

    submitTechnicianReview(executionId, payload) {
        return this.http.post(`${BASE}/${executionId}/reviews/technician`, payload);
    }
}
