export class ServiceRecipeResource {
    constructor({
        recipeId,
        serviceName,
        serviceDescription,
        serviceCategory,
        componentRequirements,
        estimatedDurationMinutes,
        materialsEstimate,
        laborCost,
        totalPrice,
        currency,
        prerequisites,
        deliverables,
        warrantyMonths,
        isActive,
        timesRequested,
        requiresIoTCertification = false
    }) {
        this.recipeId = recipeId;
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription || '';
        this.serviceCategory = serviceCategory;
        this.componentRequirements = componentRequirements || [];
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.materialsEstimate = materialsEstimate || 0;
        this.laborCost = laborCost || 0;
        this.totalPrice = totalPrice;
        this.currency = currency || 'USD';
        this.prerequisites = prerequisites || [];
        this.deliverables = deliverables || [];
        this.warrantyMonths = warrantyMonths || 0;
        this.isActive = isActive;
        this.timesRequested = timesRequested || 0;
        this.requiresIoTCertification = requiresIoTCertification;
    }
}
