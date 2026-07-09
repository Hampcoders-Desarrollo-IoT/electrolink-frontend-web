export class UpdateComponentTypeCommand {
    constructor({ name, description, isActive }) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }
}
