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
        return this.#recipeEndpoint(technicianId, recipeId).getById(recipeId);
    }

    updateRecipe(technicianId, recipeId, command) {
        return this.#recipeEndpoint(technicianId, recipeId).update(recipeId, command);
    }

    deactivateRecipe(technicianId, recipeId) {
        return this.http.delete(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}`);
    }

    reactivateRecipe(technicianId, recipeId) {
        return this.http.post(`${techniciansPath}/${technicianId}/catalog/recipes/${recipeId}/reactivate`);
    }
}
