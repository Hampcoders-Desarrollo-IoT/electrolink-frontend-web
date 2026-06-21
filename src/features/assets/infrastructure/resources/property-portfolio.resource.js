export class PropertyPortfolioResource {
    constructor({ portfolioId, ownerId, status, properties }) {
        this.portfolioId = portfolioId;
        this.ownerId = ownerId;
        this.status = status;
        this.properties = properties || [];
    }
}
