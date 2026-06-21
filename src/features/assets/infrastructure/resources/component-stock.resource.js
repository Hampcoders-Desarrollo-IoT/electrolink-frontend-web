export class ComponentStockResource {
    constructor({ componentStockId, componentId, componentName, quantityAvailable, alertThreshold, lastUpdated }) {
        this.componentStockId = componentStockId;
        this.componentId = componentId;
        this.componentName = componentName;
        this.quantityAvailable = quantityAvailable;
        this.alertThreshold = alertThreshold;
        this.lastUpdated = lastUpdated;
    }
}
