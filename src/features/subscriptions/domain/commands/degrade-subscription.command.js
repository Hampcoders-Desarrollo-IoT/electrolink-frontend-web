/**
 * DegradeSubscriptionCommand
 * Payload for degrading a subscription via POST /subscriptions/degrade.
 */
export class DegradeSubscriptionCommand {
    /**
     * @param {Object} data
     * @param {string} data.subscriptionId
     */
    constructor({ subscriptionId }) {
        this.subscriptionId = subscriptionId;
    }
}
