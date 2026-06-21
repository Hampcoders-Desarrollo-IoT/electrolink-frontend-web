export class Photo {
    constructor({
        providerId = '',
        publicUrl = '',
        thumbnailUrl = '',
        uploadedAt = ''
    } = {}) {
        this.providerId = providerId;
        this.publicUrl = publicUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.uploadedAt = uploadedAt;
    }
}
