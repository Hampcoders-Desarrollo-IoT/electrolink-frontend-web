export class InventoryItem {
    constructor({
        id = '',
        technicianInventoryId = '',
        componentId = '',
        componentName = '',
        quantityAvailable = 0,
        reservedQuantity = 0,
        alertThreshold = 0,
        lastUpdated = ''
    } = {}) {
        this.id = id;
        this.technicianInventoryId = technicianInventoryId;
        this.componentId = componentId;
        this.componentName = componentName;
        this.quantityAvailable = quantityAvailable;
        this.reservedQuantity = reservedQuantity;
        this.alertThreshold = alertThreshold;
        this.lastUpdated = lastUpdated;
    }

    get availableForReservation() {
        return this.quantityAvailable - this.reservedQuantity;
    }

    get stock() {
        return this.quantityAvailable;
    }

    get isLowStock() {
        return this.quantityAvailable <= this.alertThreshold && this.quantityAvailable > 0;
    }

    get isCriticalStock() {
        return this.quantityAvailable <= (this.alertThreshold / 2) || this.quantityAvailable === 0;
    }
}
