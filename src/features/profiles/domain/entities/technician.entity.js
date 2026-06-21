export class Technician {
    constructor({
        technicianId = '',
        specialties = [],
        experienceYears = 0,
<<<<<<< Updated upstream
        aboutMe = ''
=======
        aboutMe = '',
        centerLatitude = null,
        centerLongitude = null,
        radiusKm = null
>>>>>>> Stashed changes
    } = {}) {
        this.technicianId = technicianId;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
<<<<<<< Updated upstream
=======
        this.centerLatitude = centerLatitude;
        this.centerLongitude = centerLongitude;
        this.radiusKm = radiusKm;
>>>>>>> Stashed changes
    }
}
