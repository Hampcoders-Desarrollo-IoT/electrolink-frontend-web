export class TechnicianInventory {
    constructor({
        id = '',
        technicianId = '',
        status = '',
        stockItems = [],
        reservations = []
    } = {}) {
        this.id = id;
        this.technicianId = technicianId;
        this.status = status;
        this.stockItems = stockItems;
        this.reservations = reservations;
    }
}
