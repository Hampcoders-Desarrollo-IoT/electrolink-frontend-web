export class Technician {
    constructor({
        technicianId = '',
        specialties = [],
        experienceYears = 0,
        aboutMe = ''
    } = {}) {
        this.technicianId = technicianId;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.aboutMe = aboutMe;
    }
}
