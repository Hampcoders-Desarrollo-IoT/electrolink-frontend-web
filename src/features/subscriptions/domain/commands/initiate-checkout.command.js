/**
 * InitiateCheckoutCommand
 * Payload for starting a Stripe Checkout session for individual plans
 * (TECHNICIAN or HOMEOWNER roles).
 */
export class InitiateCheckoutCommand {
    /**
     * @param {Object} data
     * @param {string} data.planId         - The plan ID to subscribe to
     * @param {string} data.successUrl     - Redirect URL on successful payment
     * @param {string} data.cancelUrl      - Redirect URL on cancelled payment
     * @param {string|null} data.couponCode - Optional promotional code
     */
    constructor({ planId, successUrl, cancelUrl, couponCode = null }) {
        this.planId     = planId;
        this.successUrl = successUrl;
        this.cancelUrl  = cancelUrl;
        if (couponCode) {
            this.couponCode = couponCode;
        }
    }
}
