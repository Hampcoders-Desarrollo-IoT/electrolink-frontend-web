import { ComponentType } from '../../domain/entities/component-type.entity.js';
import { ComponentTypeResource } from '../resources/component-type.resource.js';

export class ComponentTypeAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ComponentType({
            id: resource.componentTypeId,
            name: resource.name,
            description: resource.description,
            isActive: resource.isActive !== undefined ? resource.isActive : (resource.status === 'Active')
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ComponentTypeResource({
            componentTypeId: entity.id,
            name: entity.name,
            description: entity.description
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
