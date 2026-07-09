export class CreateServiceRequestCommand {
    constructor({ propertyId, category, description }) {
        this.propertyId = propertyId;
        this.category = category;
        this.description = description;
    }
}
