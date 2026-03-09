export class CreateComponentCommand {
    constructor({ name, description, isActive, componentTypeId }) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.componentTypeId = componentTypeId;
    }
}
