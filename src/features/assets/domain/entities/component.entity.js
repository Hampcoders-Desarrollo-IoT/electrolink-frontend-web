export class Component {
    constructor({
        id = '',
        name = '',
        description = '',
        isActive = true,
        typeId = ''
    } = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.typeId = typeId;
    }
}
