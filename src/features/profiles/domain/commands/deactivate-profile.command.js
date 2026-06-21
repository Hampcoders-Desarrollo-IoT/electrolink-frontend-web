export class DeactivateProfileCommand {
    constructor({ reason = '', notes = '' } = {}) {
        this.reason = reason;
        this.notes = notes;
    }
}
