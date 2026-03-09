import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const homeownersEndpointPath = import.meta.env.VITE_HOMEOWNERS_ENDPOINT_PATH;

export class PropertiesApiService extends BaseApi {
    #homeownersEndpointPath;

    constructor() {
        super();
        this.#homeownersEndpointPath = new BaseEndpoint(this, homeownersEndpointPath);
    }

    #getPropertiesEndpoint(homeownerId) {
        return new BaseEndpoint(this, `${homeownersEndpointPath}/${homeownerId}/properties`);
    }

    getAll(homeownerId) {
        return this.#getPropertiesEndpoint(homeownerId).getAll();
    }

    getById(homeownerId, id) {
        return this.#getPropertiesEndpoint(homeownerId).getById(id);
    }

    create(homeownerId, command) {
        return this.#getPropertiesEndpoint(homeownerId).create(command);
    }

    update(homeownerId, id, data) {
        return this.#getPropertiesEndpoint(homeownerId).update(id, data);
    }

    delete(homeownerId, id) {
        return this.#getPropertiesEndpoint(homeownerId).delete(id);
    }
}
