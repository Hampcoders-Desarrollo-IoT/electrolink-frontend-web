export class RegisterComponentsCommand {
    constructor({ executionId, components }) {
        this.executionId = executionId;
        this.components = components;
    }
}
