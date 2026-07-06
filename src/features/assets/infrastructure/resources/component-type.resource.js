export class ComponentTypeResource {
    constructor({ componentTypeId, name = '', isActive }) {
        this.componentTypeId = componentTypeId;
        this.name = name;
        this.isActive = isActive;
    }
}
