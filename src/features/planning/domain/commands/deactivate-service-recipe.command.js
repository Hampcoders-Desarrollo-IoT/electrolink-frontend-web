export class DeactivateServiceRecipeCommand {
    constructor({ recipeId, reason, notes = '' }) {
        this.recipeId = recipeId;
        this.reason = reason;
        this.notes = notes;
    }
}
