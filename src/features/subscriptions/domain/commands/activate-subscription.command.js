/**
 * ActivateSubscriptionCommand
 * Payload for activating a cancelled subscription via POST /subscriptions/activate.
 */
export class ActivateSubscriptionCommand {
    /**
     * @param {Object} data
     * @param {string} data.subscriptionId
     */
    constructor({ subscriptionId }) {
        this.subscriptionId = subscriptionId;
    }
}
