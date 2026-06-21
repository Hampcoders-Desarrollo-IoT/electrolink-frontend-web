export class CreatePropertyCommand {
    constructor({ street, number, district, city, country, postalCode, latitude, longitude, accuracy, source, propertyType }) {
        this.street = street;
        this.number = number;
        this.district = district;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.source = source;
        this.propertyType = propertyType;
    }
}
