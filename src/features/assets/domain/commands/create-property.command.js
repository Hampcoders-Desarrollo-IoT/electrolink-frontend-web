export class CreatePropertyCommand {
    constructor({ name, street, number, city, postalCode, latitude, longitude }) {
        this.name = name;
        this.street = street;
        this.number = number;
        this.city = city;
        this.postalCode = postalCode;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
