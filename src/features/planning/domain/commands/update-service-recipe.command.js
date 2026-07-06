export class UpdateServiceRecipeCommand {
    constructor({
        recipeId,
        serviceName,
        serviceDescription,
        serviceCategory,
        requiresIoTCertification,
        componentRequirements,
        estimatedDurationHours,
        estimatedDurationMinutes,
        pricing,
        prerequisites,
        deliverables,
        warrantyMonths
    }) {
        this.recipeId = recipeId;
        this.serviceName = serviceName;
        this.serviceDescription = serviceDescription;
        this.serviceCategory = serviceCategory;
        this.requiresIoTCertification = requiresIoTCertification;
        this.componentRequirements = componentRequirements;
        this.estimatedDurationHours = estimatedDurationHours;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.pricing = pricing;
        this.prerequisites = prerequisites;
        this.deliverables = deliverables;
        this.warrantyMonths = warrantyMonths;
    }
}
