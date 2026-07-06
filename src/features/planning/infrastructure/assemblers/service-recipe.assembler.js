import { ServiceRecipe } from '../../domain/entities/service-recipe.entity.js';
import { ServiceRecipeResource } from '../resources/service-recipe.resource.js';

export class ServiceRecipeAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceRecipe({
            recipeId: resource.recipeId,
            serviceName: resource.serviceName,
            serviceDescription: resource.serviceDescription || '',
            serviceCategory: resource.serviceCategory,
            componentRequirements: resource.componentRequirements || [],
            estimatedDurationMinutes: resource.estimatedDurationMinutes,
            materialsEstimate: resource.materialsEstimate || 0,
            laborCost: resource.laborCost || 0,
            totalPrice: resource.totalPrice,
            currency: resource.currency || 'USD',
            prerequisites: resource.prerequisites || [],
            deliverables: resource.deliverables || [],
            warrantyMonths: resource.warrantyMonths || 0,
            isActive: resource.isActive,
            timesRequested: resource.timesRequested || 0,
            requiresIoTCertification: resource.requiresIoTCertification || false
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceRecipeResource({
            recipeId: entity.recipeId,
            serviceName: entity.serviceName,
            serviceDescription: entity.serviceDescription,
            serviceCategory: entity.serviceCategory,
            componentRequirements: entity.componentRequirements,
            estimatedDurationMinutes: entity.estimatedDurationMinutes,
            materialsEstimate: entity.materialsEstimate,
            laborCost: entity.laborCost,
            totalPrice: entity.totalPrice,
            currency: entity.currency,
            prerequisites: entity.prerequisites,
            deliverables: entity.deliverables,
            warrantyMonths: entity.warrantyMonths,
            isActive: entity.isActive,
            timesRequested: entity.timesRequested
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
