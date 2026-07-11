/**
 * InitiateCheckoutResource
 * Mirrors the snake_case response from POST /api/v1/subscriptions/me/checkout
 * and POST /api/v1/subscriptions/me/enterprise-checkout.
 */
export class InitiateCheckoutResource {
    constructor(data = {}) {
        this.checkout_url   = data.checkout_url ?? null;
        this.session_id     = data.session_id ?? null;
        this.expires_at     = data.expires_at ?? null;
    }
}
