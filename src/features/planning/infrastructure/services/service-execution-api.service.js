import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const serviceExecutionsPath = import.meta.env.VITE_SERVICE_EXECUTIONS_ENDPOINT_PATH;

export class ServiceExecutionApiService extends BaseApi {
    constructor() {
        super();
    }

    #executionEndpoint(executionId) {
        return new BaseEndpoint(this, `${serviceExecutionsPath}/${executionId}`);
    }

    getAssigned(technicianId) {
        return this.http.get(`${serviceExecutionsPath}/technicians/${technicianId}/assigned`);
    }

    getHistory(technicianId) {
        return this.http.get(`${serviceExecutionsPath}/technicians/${technicianId}/history`);
    }

    getById(executionId) {
        return this.#executionEndpoint(executionId).getById(executionId);
    }

    start(executionId) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/start`);
    }

    getUploadUrl(executionId) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/photos/upload-url`);
    }

    registerPhoto(executionId, resource) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/photos`, resource);
    }

    registerComponents(executionId, resource) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/components`, resource);
    }

    updateReport(executionId, resource) {
        return this.http.put(`${serviceExecutionsPath}/${executionId}/actions/report`, resource);
    }

    complete(executionId) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/complete`);
    }

    cancel(executionId) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/actions/cancel`);
    }

    toggleRelay(executionId) {
        return this.http.post(`${serviceExecutionsPath}/${executionId}/iot/toggle-relay`);
    }
}
