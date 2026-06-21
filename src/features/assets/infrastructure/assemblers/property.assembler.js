import { Property } from '../../domain/entities/property.entity.js';
import { Photo } from '../../domain/entities/photo.entity.js';
import { PropertyResource } from '../resources/property.resource.js';
import { AddressResource } from '../resources/address.resource.js';
import { GeolocationResource } from '../resources/geolocation.resource.js';

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        const photos = resource.photos
            ? resource.photos.map(p => new Photo({
                providerId: p.providerId,
                publicUrl: p.publicUrl,
                thumbnailUrl: p.thumbnailUrl,
                uploadedAt: p.uploadedAt
            }))
            : [];

        return new Property({
            id: resource.propertyId,
            ownerId: resource.ownerId,
            address: resource.address,
            geolocation: resource.geolocation,
            status: resource.status,
            isActive: resource.isActive,
            propertyType: resource.propertyType,
            mainPhotoProviderId: resource.mainPhotoProviderId,
            photos: photos
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new PropertyResource({
            propertyId: entity.id,
            ownerId: entity.ownerId,
            address: entity.address ? new AddressResource(entity.address) : null,
            geolocation: entity.geolocation ? new GeolocationResource(entity.geolocation) : null,
            status: entity.status,
            isActive: entity.isActive,
            propertyType: entity.propertyType,
            mainPhotoProviderId: entity.mainPhotoProviderId,
            photos: entity.photos || []
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
