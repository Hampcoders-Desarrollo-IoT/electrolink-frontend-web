export class ServiceRecipe {
    constructor({
        recipeId = '',
        serviceName = '',
        serviceDescription = '',
        serviceCategory = '',
        componentRequirements = [],
        estimatedDurationMinutes = 0,
        materialsEstimate = 0,
        laborCost = 0,
        totalPrice = 0,
        currency = 'USD',
        prerequisites = [],
        deliverables = [],
        warrantyMonths = 0,
        isActive = true,
        timesRequested = 0,
        requiresIoTCertification = false
    } = {}) {
        this.recipeId = recipeId;
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
        this.serviceCategory = serviceCategory;
        this.componentRequirements = componentRequirements;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.materialsEstimate = materialsEstimate;
        this.laborCost = laborCost;
        this.totalPrice = totalPrice;
        this.currency = currency;
        this.prerequisites = prerequisites;
        this.deliverables = deliverables;
        this.warrantyMonths = warrantyMonths;
        this.isActive = isActive;
        this.timesRequested = timesRequested;
        this.requiresIoTCertification = requiresIoTCertification;
    }
}
