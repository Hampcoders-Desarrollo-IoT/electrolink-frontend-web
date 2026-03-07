export class CompleteProfileAsTechnicianCommand {
    constructor({
        firstName,
        lastName,
        email,
        phoneNumber,
        dni,
        dateOfBirth,
        street,
        district,
        city,
        country,
        postalCode,
        specialties,
        experienceYears,
        aboutMe
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.dni = dni;
        this.dateOfBirth = dateOfBirth;
        this.street = street;
        this.district = district;
        this.city = city;
        this.country = country;
        this.postalCode = postalCode;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
    }
}
