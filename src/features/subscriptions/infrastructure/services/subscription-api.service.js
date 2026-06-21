import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

/**
 * SubscriptionApiService
 * Axios HTTP client for all Subscriptions & Payments endpoints.
 * Extends BaseApi to inherit the JWT interceptor and base URL configuration.
 */
export class SubscriptionApiService extends BaseApi {
    /** @type {string} */
    #basePath = '/api/v1/subscriptions/me';

    constructor() {
        super();
    }

    // ─── READ ────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/subscriptions/me
     * Returns the current user's subscription data (plan, role, counters).
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getMySubscription() {
        return this.http.get(this.#basePath);
    }

    /**
     * GET /api/v1/subscriptions/me/payment-history
     * Returns a paginated list of billing records.
     * @param {number} [page=1]
     * @param {number} [pageSize=20]
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getPaymentHistory(page = 1, pageSize = 20) {
        return this.http.get(`${this.#basePath}/payment-history`, {
            params: { page, pageSize },
        });
    }

    /**
     * GET /api/v1/subscriptions/me/status-alert
     * Returns any active business alerts:
     *  - PAYMENT_FAILED
     *  - MONTHLY_LIMIT_REACHED
     *  - PENDING_INSTALLATION
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getStatusAlert() {
        return this.http.get(`${this.#basePath}/status-alert`);
    }

    /**
     * GET /api/v1/subscriptions/me/device-billing
     * Returns IoT device billing details for COMPANY role.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getDeviceBilling() {
        return this.http.get(`${this.#basePath}/device-billing`);
    }

    // ─── WRITE ───────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/subscriptions/me/checkout
     * Initiates a Stripe Checkout session for TECHNICIAN or HOMEOWNER roles.
     * @param {Object} payload - Serialized InitiateCheckoutCommand
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    initiateCheckout(payload) {
        return this.http.post(`${this.#basePath}/checkout`, payload);
    }

    /**
     * POST /api/v1/subscriptions/me/enterprise-checkout
     * Initiates a Stripe Checkout session for COMPANY role.
     * @param {Object} payload - Enterprise checkout payload
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    initiateEnterpriseCheckout(payload) {
        return this.http.post(`${this.#basePath}/enterprise-checkout`, payload);
    }

    /**
     * POST /api/v1/subscriptions/me/portal
     * Returns the Stripe Customer Portal URL for self-service billing management.
     * @param {string} returnUrl - URL to redirect back to after portal session
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getStripePortalUrl(returnUrl) {
        return this.http.post(`${this.#basePath}/portal`, { return_url: returnUrl });
    }

    /**
     * POST /api/v1/subscriptions/me/cancel
     * Sends a deferred cancellation request with reason and feedback.
     * @param {Object} payload - Serialized CancelSubscriptionCommand
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    cancelSubscription(payload) {
        return this.http.post(`${this.#basePath}/cancel`, payload);
    }
}
