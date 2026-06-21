export class UploadUrlResource {
    constructor({ url, signature, timestamp, apiKey }) {
        this.url = url;
        this.signature = signature;
        this.timestamp = timestamp;
        this.apiKey = apiKey;
    }
}
