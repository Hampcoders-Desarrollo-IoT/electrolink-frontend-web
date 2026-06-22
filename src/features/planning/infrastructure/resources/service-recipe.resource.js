export class ServiceRecipeResource {
    constructor({ recipeId, catalogId, name, description, category, estimatedDuration, basePrice, requiresIoTCertification, requiredComponents, isActive, createdAt, updatedAt }) {
        this.recipeId = recipeId;
        this.catalogId = catalogId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDuration = estimatedDuration;
        this.basePrice = basePrice;
        this.requiresIoTCertification = requiresIoTCertification;
        this.requiredComponents = requiredComponents || [];
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
