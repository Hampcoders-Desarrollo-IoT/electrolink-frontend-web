export class UpdateComponentCommand {
    constructor({ name, description, isActive, typeId }) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
        this.typeId = typeId;
    }
}
