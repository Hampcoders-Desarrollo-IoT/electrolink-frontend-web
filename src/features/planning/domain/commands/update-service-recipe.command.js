export class UpdateServiceRecipeCommand {
    constructor({ recipeId, name, description, category, estimatedDuration, basePrice, requiresIoTCertification, requiredComponents, isActive }) {
        this.recipeId = recipeId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDuration = estimatedDuration;
        this.basePrice = basePrice;
        this.requiresIoTCertification = requiresIoTCertification;
        this.requiredComponents = requiredComponents;
        this.isActive = isActive;
    }
}
