export class Property {
    constructor({
        id = '',
        ownerId = '',
        address = null,
        geolocation = null,
        status = '',
        isActive = true,
        propertyType = '',
        mainPhotoProviderId = null,
        photos = []
    } = {}) {
        this.id = id;
        this.ownerId = ownerId;
        this.address = address;
        this.geolocation = geolocation;
        this.status = status;
        this.isActive = isActive;
        this.propertyType = propertyType;
        this.mainPhotoProviderId = mainPhotoProviderId;
        this.photos = photos;
    }

    get fullAddress() {
        if (!this.address) return '';
        const { street, number, district, city } = this.address;
        return `${street} ${number}, ${district}, ${city}`.trim();
    }
}
