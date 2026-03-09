import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const techniciansEndpointPath = import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH;

export class InventoryApiService extends BaseApi {
    #techniciansEndpoint;

    constructor() {
        super();
        this.#techniciansEndpoint = new BaseEndpoint(this, techniciansEndpointPath);
    }

    #getInventoryEndpoint(technicianId) {
        return new BaseEndpoint(this, `${techniciansEndpointPath}/${technicianId}/inventory`);
    }

    getAll() {
        return this.#getInventoryEndpoint.getAll();
    }

    getById(id) {
        return this.#getInventoryEndpoint.getById(id);
    }

    getInventory(technicianId) {
        return this.#getInventoryEndpoint(technicianId).getAll();
    }

    addStock(command) {
        return this.#getInventoryEndpoint(command.technicianId).update(command);
    }
}