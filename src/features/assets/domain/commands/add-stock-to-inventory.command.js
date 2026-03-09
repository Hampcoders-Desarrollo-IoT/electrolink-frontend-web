export class AddStockToInventoryCommand {
    constructor({ technicianId, componentId, quantity, alertThreshold }) {
        this.technicianId = technicianId;
        this.componentId = componentId;
        this.quantity = quantity;
        this.alertThreshold = alertThreshold;
    }
}
