export class PropertyResource {
    constructor({ propertyId, homeownerId, address, geolocation, status, isActive }) {
        this.propertyId = propertyId;
        this.homeownerId = homeownerId;
        this.address = address;  
        this.geolocation = geolocation; 
        this.status = status;
        this.isActive = isActive;
    }
}
