/**
 * InitiateCheckoutCommand
 * Payload for starting a Stripe Checkout session.
 */
export class InitiateCheckoutCommand {
    /**
     * @param {Object} data
     * @param {string} data.planType         - 'BASIC' | 'PREMIUM' | 'ENTERPRISE_BASIC' | 'ENTERPRISE_PRO'
     * @param {string} data.billingCycle     - 'MONTHLY' | 'YEARLY'
     * @param {string} data.successUrl       - Redirect URL on successful payment
     * @param {string} data.cancelUrl        - Redirect URL on cancelled payment
     * @param {string|null} data.couponCode  - Optional promotional code
     */
    constructor({ planType, billingCycle, successUrl, cancelUrl, couponCode = null }) {
        this.planType     = planType;
        this.billingCycle = billingCycle;
        this.successUrl   = successUrl;
        this.cancelUrl    = cancelUrl;
        if (couponCode) {
            this.couponCode = couponCode;
        }
    }
}
