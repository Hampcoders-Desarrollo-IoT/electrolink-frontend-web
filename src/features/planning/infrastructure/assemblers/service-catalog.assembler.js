import { ServiceCatalog } from '../../domain/entities/service-catalog.entity.js';
import { ServiceCatalogResource } from '../resources/service-catalog.resource.js';
import { ServiceRecipeAssembler } from './service-recipe.assembler.js';

export class ServiceCatalogAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceCatalog({
            catalogId: resource.catalogId,
            technicianId: resource.technicianId,
            status: resource.status,
            totalRecipes: resource.totalRecipes,
            recipes: resource.recipes
                ? resource.recipes.map(r => ServiceRecipeAssembler.toEntityFromResource(r))
                : []
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceCatalogResource({
            catalogId: entity.catalogId,
            technicianId: entity.technicianId,
            status: entity.status,
            totalRecipes: entity.totalRecipes,
            recipes: entity.recipes.map(r => ServiceRecipeAssembler.toResourceFromEntity(r))
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
