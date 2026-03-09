import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const componentTypesEndpointPath = import.meta.env.VITE_COMPONENT_TYPES_ENDPOINT_PATH;

export class ComponentTypeApiService extends BaseApi {
    #componentTypesEndpoint;

    constructor() {
        super();
        this.#componentTypesEndpoint = new BaseEndpoint(this, componentTypesEndpointPath);
    }

    getAll() {
        return this.#componentTypesEndpoint.getAll();
    }

    getById(id) {
        return this.#componentTypesEndpoint.getById(id);
    }

    create(command) {
        return this.#componentTypesEndpoint.create(command);
    }
}
