export class RegisterPhotosCommand {
    constructor({ executionId, providerId, publicUrl, description }) {
        this.executionId = executionId;
        this.providerId = providerId;
        this.publicUrl = publicUrl;
        this.description = description;
    }
}
