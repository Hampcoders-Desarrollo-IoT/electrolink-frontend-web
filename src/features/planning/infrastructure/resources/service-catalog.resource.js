export class ServiceCatalogResource {
    constructor({ catalogId, technicianId, status, totalRecipes, recipes }) {
        this.catalogId = catalogId;
        this.technicianId = technicianId;
        this.status = status;
        this.totalRecipes = totalRecipes;
        this.recipes = recipes || [];
    }
}
