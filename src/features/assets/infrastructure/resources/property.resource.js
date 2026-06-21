export class PropertyResource {
    constructor({ propertyId, ownerId, address, geolocation, status, isActive, propertyType, mainPhotoProviderId, photos }) {
        this.propertyId = propertyId;
        this.ownerId = ownerId;
        this.address = address;
        this.geolocation = geolocation;
        this.status = status;
        this.isActive = isActive;
        this.propertyType = propertyType;
        this.mainPhotoProviderId = mainPhotoProviderId;
        this.photos = photos || [];
    }
}
