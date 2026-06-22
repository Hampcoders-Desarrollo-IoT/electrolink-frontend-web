import { ServiceRecipe } from '../../domain/entities/service-recipe.entity.js';
import { ServiceRecipeResource } from '../resources/service-recipe.resource.js';

export class ServiceRecipeAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceRecipe({
            recipeId: resource.recipeId,
            catalogId: resource.catalogId,
            name: resource.name,
            description: resource.description,
            category: resource.category,
            estimatedDuration: resource.estimatedDuration,
            basePrice: resource.basePrice,
            requiresIoTCertification: resource.requiresIoTCertification,
            requiredComponents: resource.requiredComponents || [],
            isActive: resource.isActive,
            createdAt: resource.createdAt,
            updatedAt: resource.updatedAt
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceRecipeResource({
            recipeId: entity.recipeId,
            catalogId: entity.catalogId,
            name: entity.name,
            description: entity.description,
            category: entity.category,
            estimatedDuration: entity.estimatedDuration,
            basePrice: entity.basePrice,
            requiresIoTCertification: entity.requiresIoTCertification,
            requiredComponents: entity.requiredComponents,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
