export class UpdatePersonalDataCommand {
    constructor({
        firstName,
        lastName,
        phoneNumber,
        street,
        number,
        district,
        city,
        country,
        postalCode
    } = {}) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.street = street;
        this.number = number;
        this.district = district;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
    }
}
