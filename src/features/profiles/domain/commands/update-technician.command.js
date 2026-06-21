export class UpdateTechnicianCommand {
    constructor({
        specialties,
        experienceYears,
        aboutMe,
        centerLatitude,
        centerLongitude,
        radiusKm
    } = {}) {
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.radiusKm = radiusKm;
    }
}
