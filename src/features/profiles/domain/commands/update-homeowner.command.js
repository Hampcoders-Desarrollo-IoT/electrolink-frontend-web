export class UpdateHomeownerCommand {
    constructor({
        preferredContactTime,
        smsNotifications,
        emailNotifications,
        pushNotifications,
        emergencyContact
    } = {}) {
        this.preferredContactTime = preferredContactTime;
        this.smsNotifications = smsNotifications;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.emergencyContact = emergencyContact;
    }
}
