export class Profile {
    constructor({
        profileId = '',
        userId = '',
        status = 'Incomplete',
        businessRole = null,
        firstName = '',
        lastName = '',
        phoneNumber = '',
        dni = '',
        dateOfBirth = '',
        street = '',
        district = '',
        city = '',
        country = '',
        postalCode = '',
        technician = null,
        homeowner = null
    } = {}) {
        this.profileId = profileId;
        this.userId = userId;
        this.status = status;
        this.businessRole = businessRole;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.dni = dni;
        this.dateOfBirth = dateOfBirth;
        this.street = street;
        this.district = district;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.technician = technician;
        this.homeowner = homeowner;
    }

    get isTechnician() {
        return this.businessRole === 'Technician';
    }

    get isHomeowner() {
        return this.businessRole === 'HomeOwner';
    }

    get fullName() {
        return `${this.firstName} ${this.lastName}`.trim();
    }
}
