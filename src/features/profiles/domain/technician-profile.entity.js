export class TechnicianProfile {
    constructor({
        specialties = [],
        yearsOfExperience = '',
        certifications = [],
        coverageRadius = 0,
        location = null
    } = {}) {
        this.specialties = specialties;
        this.yearsOfExperience = yearsOfExperience;
        this.certifications = certifications;
        this.coverageRadius = coverageRadius;
        this.location = location; // { lat, lng }
    }
}
