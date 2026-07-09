export class AvailableServiceResource {
    constructor({ recipeId, name, description, category, estimatedDuration, basePrice, requiresIoTCertification, estimatedTechnicians }) {
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
