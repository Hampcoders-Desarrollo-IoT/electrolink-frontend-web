export class Profile {
    constructor({
        profileId = '',
        userId = '',
        status = 'Incomplete',
        businessRole = null,
        profilePictureUrl = '',
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
        postalCode = '',
        technician = null,
        homeowner = null,
        company = null
    } = {}) {
        this.profileId = profileId;
        this.userId = userId;
        this.status = status;
        this.businessRole = businessRole;
        this.profilePictureUrl = profilePictureUrl;
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
        this.technician = technician;
        this.homeowner = homeowner;
        this.company = company;
    }

    get isTechnician() {
        return this.businessRole === 'TECHNICIAN';
    }

    get isHomeowner() {
        return this.businessRole === 'HOMEOWNER';
    }

    get isCompany() {
        return this.businessRole === 'COMPANY';
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
}
