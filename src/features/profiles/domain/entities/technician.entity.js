export class Technician {
    constructor({
        technicianId = '',
        specialties = [],
        experienceYears = 0,
        aboutMe = '',
        centerLatitude = null,
        centerLongitude = null,
        radiusKm = null
    } = {}) {
        this.technicianId = technicianId;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.radiusKm = radiusKm;
    }
}

