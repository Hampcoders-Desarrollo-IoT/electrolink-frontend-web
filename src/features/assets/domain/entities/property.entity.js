export class Property {
    constructor({
        id = '',
        ownerId = '',
        address = null,
        geolocation = null,
        status = '',
        isActive = true
    } = {}) {
        this.id = id;
        this.ownerId = ownerId;
        this.address = address;
        this.geolocation = geolocation;
        this.status = status;
        this.isActive = isActive;
    }

    get fullAddress() {
        if (!this.address) return '';
        const { street, number, district, city } = this.address;
        return `${street} ${number}, ${district}, ${city}`.trim();
    }
}
