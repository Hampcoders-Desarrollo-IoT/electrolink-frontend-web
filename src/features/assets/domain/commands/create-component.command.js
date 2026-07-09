export class CreateComponentCommand {
    constructor({ name, description, isActive }) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }
}

