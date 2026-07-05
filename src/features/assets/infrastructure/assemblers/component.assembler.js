import { Component } from '../../domain/entities/component.entity.js';
import { ComponentResource } from '../resources/component.resource.js';

export class ComponentAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Component({
            id: resource.componentId,
            name: resource.name,
            description: resource.description,
            isActive: resource.isActive
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ComponentResource({
            componentId: entity.id,
            name: entity.name,
            description: entity.description,
            isActive: entity.isActive
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
