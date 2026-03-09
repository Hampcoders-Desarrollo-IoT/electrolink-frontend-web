export class PortfolioEntry {
    constructor({
        id = '',
        portfolioId = '',
        propertyId = '',
        nickname = '',
        isPrimary = false,
        occupancyStatus = ''
    } = {}) {
        this.id = id;
        this.portfolioId = portfolioId;
        this.propertyId = propertyId;
        this.nickname = nickname;
        this.isPrimary = isPrimary;
        this.occupancyStatus = occupancyStatus;
    }
}
