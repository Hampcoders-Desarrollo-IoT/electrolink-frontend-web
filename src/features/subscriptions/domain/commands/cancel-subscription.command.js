/**
 * CancelSubscriptionCommand
 * Payload sent to the backend when a user requests deferred cancellation.
 * The subscription remains active until the end of the billing period.
 */
export class CancelSubscriptionCommand {
    /**
     * @param {Object} data
     * @param {string} data.reason    - Categorical reason (e.g. 'TOO_EXPENSIVE', 'NOT_USING', 'OTHER')
     * @param {string} data.feedback  - Optional free-text feedback from the user
     */
    constructor({ reason, feedback = '' }) {
        this.reason   = reason;
        this.feedback = feedback;
    }
}
