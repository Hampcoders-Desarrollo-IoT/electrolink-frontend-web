export class PortfolioEntryResource {
    constructor({ propertyId, nickname, isPrimary, occupancyStatus }) {
        this.propertyId = propertyId;
        this.nickname = nickname;
        this.isPrimary = isPrimary;
        this.occupancyStatus = occupancyStatus;
    }
}
