export class CompleteProfileAsHomeownerCommand {
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
        preferredContactTime,
        smsNotifications,
        emailNotifications,
        pushNotifications,
        emergencyContact = null
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
        this.preferredContactTime = preferredContactTime;
        this.smsNotifications = smsNotifications;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.emergencyContact = emergencyContact;
    }
}
