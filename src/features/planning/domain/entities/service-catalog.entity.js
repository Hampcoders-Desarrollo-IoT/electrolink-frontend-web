export class ServiceCatalog {
    constructor({
        catalogId = '',
        technicianId = '',
        status = 'ACTIVE',
        totalRecipes = 0,
        recipes = []
    } = {}) {
        this.catalogId = catalogId;
        this.technicianId = technicianId;
        this.status = status;
        this.totalRecipes = totalRecipes;
        this.recipes = recipes;
    }
}
