export class GeolocationResource {
    constructor({ latitude, longitude, accuracy, source }) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.accuracy = accuracy;
        this.source = source;
    }
}
