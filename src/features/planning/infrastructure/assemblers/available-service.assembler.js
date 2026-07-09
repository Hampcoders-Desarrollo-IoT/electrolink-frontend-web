import { AvailableService } from '../../domain/entities/available-service.entity.js';
import { AvailableServiceResource } from '../resources/available-service.resource.js';

export class AvailableServiceAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new AvailableService({
            recipeId: resource.recipeId,
            name: resource.name,
            description: resource.description,
            category: resource.category,
            estimatedDuration: resource.estimatedDuration,
            basePrice: resource.basePrice,
            requiresIoTCertification: resource.requiresIoTCertification,
            estimatedTechnicians: resource.estimatedTechnicians
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
