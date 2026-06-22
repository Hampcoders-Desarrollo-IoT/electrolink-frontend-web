export class UpdateServiceDetailsCommand {
    constructor({ description, preferredDate, notes }) {
        this.description = description;
        this.preferredDate = preferredDate;
        this.notes = notes;
    }
}
