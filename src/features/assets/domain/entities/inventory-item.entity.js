export class InventoryItem {
    constructor({
        id = '',
        technicianInventoryId = '',
        componentId = '',
        quantityAvailable = 0,
        reservedQuantity = 0,
        alertThreshold = 0,
        lastUpdated = ''
    } = {}) {
        this.id = id;
        this.technicianInventoryId = technicianInventoryId;
        this.componentId = componentId;
        this.quantityAvailable = quantityAvailable;
        this.reservedQuantity = reservedQuantity;
        this.alertThreshold = alertThreshold;
        this.lastUpdated = lastUpdated;
    }

    get availableForReservation() {
        return this.quantityAvailable - this.reservedQuantity;
    }

    get isLowStock() {
        return this.quantityAvailable <= this.alertThreshold;
    }
}
