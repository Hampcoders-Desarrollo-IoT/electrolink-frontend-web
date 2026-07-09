export class ComponentStockResource {
    constructor({ componentStockId, componentId, componentTypeId, componentName, quantityAvailable, alertThreshold, lastUpdated }) {
        this.componentStockId = componentStockId;
        this.componentId = componentId;
        this.componentTypeId = componentTypeId;
        this.componentName = componentName;
        this.quantityAvailable = quantityAvailable;
        this.alertThreshold = alertThreshold;
        this.lastUpdated = lastUpdated;
    }
}
