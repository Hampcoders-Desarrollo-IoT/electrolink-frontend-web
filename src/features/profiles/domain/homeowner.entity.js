export class Homeowner {
    constructor({
        homeownerId = '',
        preferredContactTime = 'Morning',
        smsNotifications = false,
        emailNotifications = false,
        pushNotifications = false,
        emergencyContactName = '',
        emergencyContactRelationship = '',
        emergencyContactPhone = ''
    } = {}) {
        this.homeownerId = homeownerId;
        this.preferredContactTime = preferredContactTime;
        this.smsNotifications = smsNotifications;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
        this.emergencyContactName = emergencyContactName;
        this.emergencyContactRelationship = emergencyContactRelationship;
        this.emergencyContactPhone = emergencyContactPhone;
    }
}
