import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';
import { BaseEndpoint } from '@/shared/infrastructure/apis/base-endpoint.js';

const techniciansPath = import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH;

export class ServiceCatalogApiService extends BaseApi {
    constructor() {
        super();
    }

    #catalogEndpoint(technicianId) {
        return new BaseEndpoint(this, `${techniciansPath}/${technicianId}/catalog`);
    }

    #recipeEndpoint(technicianId, recipeId) {
        return new BaseEndpoint(this, `${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}`);
    }

    createCatalog(technicianId) {
        return this.http.post(`${techniciansPath}/${technicianId}/catalog`);
    }

    getCatalog(technicianId) {
        return this.#catalogEndpoint(technicianId).getAll();
    }

    createRecipe(technicianId, command) {
        return this.http.post(`${techniciansPath}/${technicianId}/catalog/recipes`, command);
    }

    getRecipe(technicianId, recipeId) {
        return this.http.get(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}`);
    }

    updateRecipe(technicianId, recipeId, command) {
        return this.http.patch(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}`, command);
    }

    deactivateRecipe(technicianId, recipeId, { reason, notes } = {}) {
        return this.http.delete(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}`, {
            data: { reason, notes }
        });
    }

    reactivateRecipe(technicianId, recipeId) {
        return this.http.post(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}/reactivate`);
    }
}
