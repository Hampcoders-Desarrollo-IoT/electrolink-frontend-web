import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const serviceRequestsPath = import.meta.env.VITE_SERVICE_REQUESTS_ENDPOINT_PATH;

export class ServiceRequestApiService extends BaseApi {
    #serviceRequestsEndpoint;

    constructor() {
        super();
        this.#serviceRequestsEndpoint = new BaseEndpoint(this, serviceRequestsPath);
    }

    #requestEndpoint(requestId) {
        return new BaseEndpoint(this, `${serviceRequestsPath}/${requestId}`);
    }

    getAllRequests() {
        return this.#serviceRequestsEndpoint.getAll();
    }

    getEligibility() {
        return this.http.get(`${serviceRequestsPath}/eligibility`);
    }

    create(command) {
        return this.#serviceRequestsEndpoint.create(command);
    }

    selectProperty(requestId, resource) {
        return this.http.post(`${serviceRequestsPath}/${requestId}/property`, resource);
    }

    getAvailableServices(requestId) {
        return this.http.get(`${serviceRequestsPath}/${requestId}/available-services`);
    }

    selectRecipe(requestId, resource) {
        return this.http.post(`${serviceRequestsPath}/${requestId}/recipe`, resource);
    }

    addDetails(requestId, resource) {
        return this.http.post(`${serviceRequestsPath}/${requestId}/details`, resource);
    }

    confirm(requestId) {
        return this.http.post(`${serviceRequestsPath}/${requestId}/confirm`);
    }

    getById(requestId) {
        return this.#requestEndpoint(requestId).getById(requestId);
    }

    delete(requestId) {
        return this.#requestEndpoint(requestId).delete(requestId);
    }
}
