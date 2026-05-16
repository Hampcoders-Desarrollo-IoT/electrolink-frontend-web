import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const techniciansEndpointPath = import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH;

export class ComponentTypeApiService extends BaseApi {
    #techniciansEndpoint;

    constructor() {
        super();
        this.#techniciansEndpoint = new BaseEndpoint(this, techniciansEndpointPath);
    }

    #getComponentTypesEndpoint(technicianId) {
        return new BaseEndpoint(this, `${techniciansEndpointPath}/${technicianId}/component-types`);
    }

    getAll(technicianId) {
        return this.#getComponentTypesEndpoint(technicianId).getAll();
    }

    getById(technicianId, id) {
        return this.#getComponentTypesEndpoint(technicianId).getById(id);
    }

    create(technicianId, command) {
        return this.#getComponentTypesEndpoint(technicianId).create(command);
    }

    update(technicianId, id, command) {
        return this.#getComponentTypesEndpoint(technicianId).update(id, command);
    }

    delete(technicianId, id) {
        return this.#getComponentTypesEndpoint(technicianId).delete(id);
    }

    activate(technicianId, typeId) {
        return this.http.patch(`${techniciansEndpointPath}/${technicianId}/component-types/${typeId}/activate`);
    }

    deactivate(technicianId, typeId) {
        return this.http.patch(`${techniciansEndpointPath}/${technicianId}/component-types/${typeId}/deactivate`);
    }
}
