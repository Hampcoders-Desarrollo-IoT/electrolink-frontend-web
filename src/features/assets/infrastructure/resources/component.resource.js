export class ComponentResource {
    constructor({ componentId, name, description, isActive, componentTypeId }) {
        this.componentId = componentId;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.componentTypeId = componentTypeId;
    }
}
