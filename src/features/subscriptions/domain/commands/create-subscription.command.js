/**
 * CreateSubscriptionCommand
 * Payload for creating a new subscription via POST /subscriptions.
 */
export class CreateSubscriptionCommand {
    /**
     * @param {Object} data
     * @param {string} data.planType
     * @param {string} data.billingCycle
     */
    constructor({ planType, billingCycle }) {
        this.planType     = planType;
        this.billingCycle = billingCycle;
    }
}
