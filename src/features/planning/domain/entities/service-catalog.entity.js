export class ServiceCatalog {
    constructor({
        catalogId = '',
        technicianId = '',
        isActive = true,
        recipes = [],
        createdAt = null,
        updatedAt = null
    } = {}) {
        this.catalogId = catalogId;
        this.technicianId = technicianId;
        this.isActive = isActive;
        this.recipes = recipes;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
