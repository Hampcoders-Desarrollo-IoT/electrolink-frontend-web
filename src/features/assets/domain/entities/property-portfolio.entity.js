export class PropertyPortfolio {
    constructor({
        id = '',
        homeownerId = '',
        status = '',
        entries = []
    } = {}) {
        this.id = id;
        this.homeownerId = homeownerId;
        this.status = status;
        this.entries = entries;
    }
}
