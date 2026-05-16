import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const techniciansEndpointPath = import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH;

export class ComponentApiService extends BaseApi {
    #techniciansEndpoint;

    constructor() {
        super();
        this.#techniciansEndpoint = new BaseEndpoint(this, techniciansEndpointPath);
    }

    #getComponentsEndpoint(technicianId) {
        return new BaseEndpoint(this, `${techniciansEndpointPath}/${technicianId}/components`);
    }

    getAll(technicianId) {
        return this.#getComponentsEndpoint(technicianId).getAll();
    }

    getById(technicianId, id) {
        return this.#getComponentsEndpoint(technicianId).getById(id);
    }

    create(technicianId, command) {
        return this.#getComponentsEndpoint(technicianId).create(command);
    }

    update(technicianId, id, command) {
        return this.#getComponentsEndpoint(technicianId).update(id, command);
    }

    delete(technicianId, id) {
        return this.#getComponentsEndpoint(technicianId).delete(id);
    }
}
