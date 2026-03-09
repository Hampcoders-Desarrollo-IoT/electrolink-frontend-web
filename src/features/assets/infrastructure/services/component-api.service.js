import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const componentsEndpointPath = import.meta.env.VITE_COMPONENTS_ENDPOINT_PATH;

export class ComponentApiService extends BaseApi {
    #componentsEndpoint;

    constructor() {
        super();
        this.#componentsEndpoint = new BaseEndpoint(this, componentsEndpointPath);
    }

    getAll() {
        return this.#componentsEndpoint.getAll();
    }

    getById(id) {
        return this.#componentsEndpoint.getById(id);
    }

    create(command) {
        return this.#componentsEndpoint.create(command);
    }
}
