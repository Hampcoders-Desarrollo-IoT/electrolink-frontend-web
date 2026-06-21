export class AddStockToInventoryCommand {
    constructor({ componentId, componentTypeId, quantity, alertThreshold }) {
        this.componentId = componentId;
        this.componentTypeId = componentTypeId;
        this.quantity = quantity;
        this.alertThreshold = alertThreshold;
    }
}

