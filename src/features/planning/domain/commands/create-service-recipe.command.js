export class CreateServiceRecipeCommand {
    constructor({ name, description, category, estimatedDuration, basePrice, requiresIoTCertification, requiredComponents }) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDuration = estimatedDuration;
        this.basePrice = basePrice;
        this.requiresIoTCertification = requiresIoTCertification;
        this.requiredComponents = requiredComponents;
    }
}
