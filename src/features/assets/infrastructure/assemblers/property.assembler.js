import { Property } from '../../domain/entities/property.entity.js';
import { PropertyResource } from '../resources/property.resource.js';
import { AddressResource } from '../resources/address.resource.js';
import { GeolocationResource } from '../resources/geolocation.resource.js';

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Property({
            id: resource.propertyId,
            ownerId: resource.homeownerId,
            address: resource.address,
            geolocation: resource.geolocation,
            status: resource.status,
            isActive: resource.isActive
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new PropertyResource({
            propertyId: entity.id,
            homeownerId: entity.ownerId,
            address: entity.address ? new AddressResource(entity.address) : null,
            geolocation: entity.geolocation ? new GeolocationResource(entity.geolocation) : null,
            status: entity.status,
            isActive: entity.isActive
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
