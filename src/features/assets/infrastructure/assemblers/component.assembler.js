import { Component } from '../../domain/entities/component.entity.js';
import { ComponentType } from '../../domain/entities/component-type.entity.js';
import { ComponentResource } from '../resources/component.resource.js';
import { ComponentTypeResource } from '../resources/component-type.resource.js';

export class ComponentAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Component({
            id: resource.componentId,
            name: resource.name,
            description: resource.description,
            isActive: resource.isActive,
            typeId: resource.componentTypeId
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ComponentResource({
            componentId: entity.id,
            name: entity.name,
            description: entity.description,
            isActive: entity.isActive,
            componentTypeId: entity.typeId
        });
    }

    static toTypeEntityFromResource(resource) {
        if (!resource) return null;
        return new ComponentType({
            id: resource.componentTypeId,
            name: resource.name,
            description: resource.description
        });
    }

    static toTypeResourceFromEntity(entity) {
        if (!entity) return null;
        return new ComponentTypeResource({
            componentTypeId: entity.id,
            name: entity.name,
            description: entity.description
        });
    }

    static toCreateCommandFromResource(resource) {
        if (!resource) return null;
        return {
            name: resource.name,
            description: resource.description,
            isActive: resource.isActive,
            componentTypeId: resource.componentTypeId
        };
    }

    static toCreateTypeCommandFromResource(resource) {
        if (!resource) return null;
        return {
            name: resource.name,
            description: resource.description
        };
    }
}
