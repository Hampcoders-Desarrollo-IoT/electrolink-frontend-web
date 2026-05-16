export class CompleteProfileAsHomeownerCommand {
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
        preferredContactTime,
        smsNotifications,
        emailNotifications,
        pushNotifications,
        emergencyContact = null
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
        this.preferredContactTime = preferredContactTime;
        this.smsNotifications = smsNotifications;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.emergencyContact = emergencyContact;
    }
}
