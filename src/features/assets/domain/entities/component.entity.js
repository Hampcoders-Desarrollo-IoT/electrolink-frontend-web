export class Component {
    constructor({
        id = '',
        name = '',
        description = '',
        isActive = true
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }
}
