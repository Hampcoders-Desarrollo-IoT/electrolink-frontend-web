export class UpdateComponentStockCommand {
    constructor({ newQuantity, newAlertThreshold }) {
        this.newQuantity = newQuantity;
        this.newAlertThreshold = newAlertThreshold;
    }
}
