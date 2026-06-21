export class Component {
    constructor({
        id = '',
        name = '',
        description = '',
        isActive = true,
        componentTypeId = ''
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.componentTypeId = componentTypeId;
    }
}
