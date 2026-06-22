export class ServiceRecipe {
    constructor({
        recipeId = '',
        catalogId = '',
        name = '',
        description = '',
        category = '',
        estimatedDuration = 0,
        basePrice = 0,
        requiresIoTCertification = false,
        requiredComponents = [],
        isActive = true,
        createdAt = null,
        updatedAt = null
    } = {}) {
        this.recipeId = recipeId;
        this.catalogId = catalogId;
        this.name = name;
        this.description = description;
        this.category = category;
        this.estimatedDuration = estimatedDuration;
        this.basePrice = basePrice;
        this.requiresIoTCertification = requiresIoTCertification;
        this.requiredComponents = requiredComponents;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
