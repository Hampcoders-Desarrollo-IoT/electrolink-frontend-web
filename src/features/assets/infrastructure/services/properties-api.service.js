import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const homeownersEndpointPath = import.meta.env.VITE_HOMEOWNERS_ENDPOINT_PATH;

export class PropertiesApiService extends BaseApi {
    constructor() {
        super();
    }

    #propertiesPath(homeownerId) {
        return `${homeownersEndpointPath}/${homeownerId}/properties`;
    }

    getAll(homeownerId) {
        return this.http.get(this.#propertiesPath(homeownerId));
    }

    getById(homeownerId, id) {
        return this.http.get(`${this.#propertiesPath(homeownerId)}/${id}`);
    }

    create(homeownerId, command) {
        return this.http.post(this.#propertiesPath(homeownerId), command);
    }

    updateAddress(homeownerId, propertyId, resource) {
        return this.http.patch(`${this.#propertiesPath(homeownerId)}/${propertyId}/address`, resource);
    }

    updateGeolocation(homeownerId, propertyId, resource) {
        return this.http.patch(`${this.#propertiesPath(homeownerId)}/${propertyId}/geolocation`, resource);
    }

    activate(homeownerId, propertyId) {
        return this.http.patch(`${this.#propertiesPath(homeownerId)}/${propertyId}/activate`);
    }

    deactivate(homeownerId, propertyId) {
        return this.http.patch(`${this.#propertiesPath(homeownerId)}/${propertyId}/deactivate`);
    }

    /** @param {string} reason — requerido por el backend como query param */
    delete(homeownerId, propertyId, reason = '') {
        const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return this.http.delete(`${this.#propertiesPath(homeownerId)}/${propertyId}${params}`);
    }
}
