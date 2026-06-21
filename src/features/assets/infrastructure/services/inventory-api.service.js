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

    #getStockItemsEndpoint(technicianId) {
        return new BaseEndpoint(this, `${techniciansEndpointPath}/${technicianId}/inventory/stock-items`);
    }

    #getComponentEndpoint(technicianId, componentId) {
        return new BaseEndpoint(this, `${techniciansEndpointPath}/${technicianId}/inventory/${componentId}`);
    }

    createInventory(technicianId) {
        return this.#getInventoryEndpoint(technicianId).create({});
    }

    getInventory(technicianId) {
        return this.#getInventoryEndpoint(technicianId).getAll();
    }

    getStockItems(technicianId) {
        return this.#getStockItemsEndpoint(technicianId).getAll();
    }

    addStock(technicianId, command) {
        return this.#getStockItemsEndpoint(technicianId).create(command);
    }

    updateStock(technicianId, componentId, command) {
        return this.#getComponentEndpoint(technicianId, componentId).update(command);
    }

    removeStock(technicianId, componentId) {
        return this.#getComponentEndpoint(technicianId, componentId).delete();
    }

    increaseStock(technicianId, componentId, data) {
        return this.http.patch(`${techniciansEndpointPath}/${technicianId}/inventory/${componentId}/increase`, data);
    }

    decreaseStock(technicianId, componentId, data) {
        return this.http.patch(`${techniciansEndpointPath}/${technicianId}/inventory/${componentId}/decrease`, data);
    }
}