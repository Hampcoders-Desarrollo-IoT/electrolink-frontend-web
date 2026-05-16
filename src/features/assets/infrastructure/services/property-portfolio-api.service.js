import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const homeownersEndpointPath = import.meta.env.VITE_HOMEOWNERS_ENDPOINT_PATH;

export class PropertyPortfolioApiService extends BaseApi {
    #homeownersEndpointPath;

    constructor() {
        super();
        this.#homeownersEndpointPath = new BaseEndpoint(this, homeownersEndpointPath);
    }

    #getPropertyPortfoliosEndpoint(homeownerId) {
        return new BaseEndpoint(this, `${homeownersEndpointPath}/${homeownerId}/propertyportfolios`);
    }

    getAll(homeownerId) {
        return this.#getPropertyPortfoliosEndpoint(homeownerId).getAll();
    }

    getById(homeownerId, id) {
        return this.#getPropertyPortfoliosEndpoint(homeownerId).getById(id);
    }

    create(homeownerId, command) {
        const endpoint = new BaseEndpoint(this, `${homeownersEndpointPath}/${homeownerId}/propertyportfolios/properties`);
        return endpoint.create(command);
    }

    update(homeownerId, id, data) {
        return this.#getPropertyPortfoliosEndpoint(homeownerId).update(id, data);
    }

    delete(homeownerId, id, reason = '') {
        const endpoint = new BaseEndpoint(this, `${homeownersEndpointPath}/${homeownerId}/propertyportfolios/properties`);
        return endpoint.delete(`${id}?reason=${encodeURIComponent(reason)}`);
    }
}
