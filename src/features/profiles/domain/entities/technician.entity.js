export class Technician {
    constructor({
        technicianId = '',
        specialties = [],
        experienceYears = 0,
        aboutMe = '',
        serviceArea = null
    } = {}) {
        this.technicianId = technicianId;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
        this.serviceArea = serviceArea; // { centerLatitude, centerLongitude, radiusKm }
    }
}

