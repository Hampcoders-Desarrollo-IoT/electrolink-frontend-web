export class CompleteProfileAsCompanyCommand {
    constructor({
        companyName,
        taxId,
        billingStreet,
        billingNumber,
        billingDistrict,
        billingCity,
        billingCountry,
        billingPostalCode,
        industry = '',
        companySize,
        website = '',
        firstName = '',
        lastName = '',
        phoneNumber = '',
        dni = '',
        dateOfBirth = '',
        street = '',
        number = '',
        district = '',
        city = '',
        country = '',
        postalCode = ''
    }) {
        this.companyName = companyName;
        this.taxId = taxId;
        this.billingStreet = billingStreet;
        this.billingNumber = billingNumber;
        this.billingDistrict = billingDistrict;
        this.billingCity = billingCity;
        this.billingCountry = billingCountry;
        this.billingPostalCode = billingPostalCode;
        this.industry = industry;
        this.companySize = companySize;
        this.website = website;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.dni = dni;
        this.dateOfBirth = dateOfBirth;
        this.street = street;
        this.number = number;
        this.district = district;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
    }
}
