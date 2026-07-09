import { ServiceSuggestion } from '../../domain/entities/service-suggestion.entity.js';
import { ServiceSuggestionResource } from '../resources/service-suggestion.resource.js';

export class ServiceSuggestionAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceSuggestion({
            suggestionId: resource.suggestionId,
            clientId: resource.clientId,
            clientType: resource.clientType,
            propertyId: resource.propertyId,
            title: resource.title,
            description: resource.description,
            severity: resource.severity,
            category: resource.category,
            isViewed: resource.isViewed,
            isAccepted: resource.isAccepted,
            isDismissed: resource.isDismissed,
            createdAt: resource.createdAt,
            metadata: resource.metadata || {}
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceSuggestionResource({
            suggestionId: entity.suggestionId,
            clientId: entity.clientId,
            clientType: entity.clientType,
            propertyId: entity.propertyId,
            title: entity.title,
            description: entity.description,
            severity: entity.severity,
            category: entity.category,
            isViewed: entity.isViewed,
            isAccepted: entity.isAccepted,
            isDismissed: entity.isDismissed,
            createdAt: entity.createdAt,
            metadata: entity.metadata
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
