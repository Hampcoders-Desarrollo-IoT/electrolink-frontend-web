export class ComponentType {
    constructor({
        id = '',
        name = '',
        isActive = true
    } = {}) {
        this.id = id;
        this.name = name;
        this.isActive = isActive;
    }
}
