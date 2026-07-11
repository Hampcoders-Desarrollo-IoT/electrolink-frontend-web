import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

/**
 * SubscriptionApiService
 * Axios HTTP client for all Subscriptions endpoints.
 * Extends BaseApi to inherit the JWT interceptor and base URL configuration.
 */
export class SubscriptionApiService extends BaseApi {
    /** @type {string} */
    #basePath = '/subscriptions';

    constructor() {
        super();
    }

    // ─── READ ────────────────────────────────────────────────────────────────

    /**
     * GET /api/v1/subscriptions/me
     * Returns the current user's subscription data.
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getMySubscription() {
        return this.http.get(`${this.#basePath}/me`);
    }

    // ─── WRITE ───────────────────────────────────────────────────────────────

    /**
     * POST /api/v1/subscriptions/checkout
     * Initiates a Stripe Checkout session.
     * @param {Object} payload - { planType, billingCycle, successUrl, cancelUrl }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    initiateCheckout(payload) {
        return this.http.post(`${this.#basePath}/checkout`, payload);
    }

    /**
     * POST /api/v1/subscriptions/cancel
     * Sends a deferred cancellation request.
     * @param {Object} payload - { reason, feedback }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    cancelSubscription(payload) {
        return this.http.post(`${this.#basePath}/cancel`, payload);
    }

    /**
     * POST /api/v1/subscriptions/me/portal
     * Returns the Stripe Customer Portal URL for self-service billing management.
     * @param {Object} payload - { returnUrl }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    getStripePortalUrl(payload) {
        return this.http.post(`${this.#basePath}/me/portal`, payload);
    }

    /**
     * POST /api/v1/subscriptions
     * Creates a new subscription.
     * @param {Object} payload - { planType, billingCycle }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    createSubscription(payload) {
        return this.http.post(`${this.#basePath}`, payload);
    }

    /**
     * POST /api/v1/subscriptions/activate
     * Reactivates a cancelled subscription.
     * @param {Object} payload - { subscriptionId }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    activateSubscription(payload) {
        return this.http.post(`${this.#basePath}/activate`, payload);
    }

    /**
     * POST /api/v1/subscriptions/degrade
     * Degrades a subscription back to free tier.
     * @param {Object} payload - { subscriptionId }
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    degradeSubscription(payload) {
        return this.http.post(`${this.#basePath}/degrade`, payload);
    }
}
