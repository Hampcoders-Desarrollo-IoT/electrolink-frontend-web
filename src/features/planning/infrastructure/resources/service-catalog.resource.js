export class ServiceCatalogResource {
    constructor({ catalogId, technicianId, isActive, recipes, createdAt, updatedAt }) {
        this.catalogId = catalogId;
        this.technicianId = technicianId;
        this.isActive = isActive;
        this.recipes = recipes || [];
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
