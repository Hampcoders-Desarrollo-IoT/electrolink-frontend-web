export class CompleteProfileAsTechnicianCommand {
    constructor({
        firstName,
        lastName,
        phoneNumber,
        dni,
        dateOfBirth,
        street,
        number,
        district,
        city,
        country,
        postalCode,
        specialties,
        experienceYears,
        aboutMe,
        centerLatitude,
        centerLongitude,
        radiusKm
    }) {
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
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.radiusKm = radiusKm;
    }
}

