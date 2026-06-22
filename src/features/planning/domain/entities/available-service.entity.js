export class AvailableService {
    constructor({
        recipeId = '',
        name = '',
        description = '',
        category = '',
        estimatedDuration = 0,
        basePrice = 0,
        requiresIoTCertification = false,
        estimatedTechnicians = 0
    } = {}) {
        this.recipeId = recipeId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDuration = estimatedDuration;
        this.basePrice = basePrice;
        this.requiresIoTCertification = requiresIoTCertification;
        this.estimatedTechnicians = estimatedTechnicians;
    }
}
