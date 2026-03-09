export class AddPropertyToPortfolioCommand {
    constructor({ homeownerId, propertyId, nickname, isPrimary, occupancyStatus }) {
        this.homeownerId = homeownerId;
        this.propertyId = propertyId;
        this.nickname = nickname;
        this.isPrimary = isPrimary;
        this.occupancyStatus = occupancyStatus;
    }
}