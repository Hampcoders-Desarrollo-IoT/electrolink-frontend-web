import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SubscriptionApiService } from '../infrastructure/services/subscription-api.service.js';
import { SubscriptionAssembler } from '../infrastructure/assembler/subscription.assembler.js';
import { InitiateCheckoutCommand } from '../domain/commands/initiate-checkout.command.js';
import { CancelSubscriptionCommand } from '../domain/commands/cancel-subscription.command.js';

const api = new SubscriptionApiService();

/**
 * useSubscriptionStore
 * Centralized Pinia store for all subscription state, history,
 * and role-based computed getters.
 */
export const useSubscriptionStore = defineStore('subscriptions', () => {

    // ─── State ────────────────────────────────────────────────────────────────

    /** @type {import('vue').Ref<import('../domain/models/subscription.entity.js').SubscriptionEntity|null>} */
    const subscription = ref(null);

    /** @type {import('vue').Ref<import('../domain/models/payment-record.entity.js').PaymentRecordEntity[]>} */
    const paymentHistory = ref([]);

    /** @type {import('vue').Ref<{type: string, message: string}|null>} */
    const activeAlert = ref(null);

    /** @type {import('vue').Ref<Object|null>} */
    const deviceBilling = ref(null);

    const isLoading        = ref(false);
    const isCheckoutLoading = ref(false);
    const isCancelLoading  = ref(false);
    const isPortalLoading  = ref(false);
    const errors           = ref([]);

    // Pagination state for payment history
    const historyPage     = ref(1);
    const historyPageSize = ref(20);
    const historyTotal    = ref(0);

    // ─── Getters (Computed) ───────────────────────────────────────────────────

    /** Current business role from the subscription entity */
    const businessRole = computed(() => subscription.value?.businessRole ?? null);

    /** Whether the current user is a HOMEOWNER */
    const isHomeowner = computed(() => businessRole.value === 'HOMEOWNER');

    /** Whether the current user is a COMPANY */
    const isCompany = computed(() => businessRole.value === 'COMPANY');

    /** Whether the current user is a TECHNICIAN */
    const isTechnician = computed(() => businessRole.value === 'TECHNICIAN');

    /** Whether a HOMEOWNER on BASIC plan should see the quota tracker */
    const showQuotaTracker = computed(() =>
        isHomeowner.value && subscription.value?.planTier === 'BASIC'
    );

    /** Whether a COMPANY should see the enterprise billing block */
    const showEnterpriseBilling = computed(() =>
        isCompany.value && subscription.value?.isActive
    );

    /** Whether to show the pending IoT installation banner */
    const showPendingInstallationBanner = computed(() =>
        isCompany.value && subscription.value?.isPendingInstallation
    );

    /** Whether to show the quota near-limit warning for HOMEOWNER */
    const showQuotaWarning = computed(() =>
        showQuotaTracker.value && subscription.value?.isNearQuota
    );

    /** Whether the HOMEOWNER has reached their request limit */
    const isQuotaExhausted = computed(() =>
        isHomeowner.value && subscription.value?.isQuotaExhausted
    );

    /** Percentage (0-100) of monthly quota consumed */
    const quotaPercent = computed(() =>
        subscription.value?.quotaUsagePercent ?? 0
    );

    /** Whether the subscription is currently active */
    const isActive = computed(() => subscription.value?.isActive ?? false);

    /** Whether the subscription is in a grace period */
    const isInGracePeriod = computed(() => subscription.value?.isInGracePeriod ?? false);

    /** Display-ready plan name */
    const planName = computed(() => subscription.value?.planName ?? '—');

    /** Display-ready plan status label */
    const statusLabel = computed(() => subscription.value?.statusLabel ?? '—');

    /** PrimeVue severity for status tag */
    const statusSeverity = computed(() => subscription.value?.statusSeverity ?? 'secondary');

    // ─── Actions ──────────────────────────────────────────────────────────────

    /**
     * Loads the current user's subscription data from the API.
     */
    async function fetchSubscription() {
        isLoading.value = true;
        errors.value = [];
        try {
            const response = await api.getMySubscription();
            const resource = SubscriptionAssembler.toResourceFromResponse(response);
            if (resource) {
                subscription.value = SubscriptionAssembler.toEntityFromResource(resource);
            }
        } catch (error) {
            console.error('[SubscriptionStore] fetchSubscription error:', error.message);
            errors.value.push({ code: 'FETCH_SUBSCRIPTION_FAILED', message: error.message });
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Loads the paginated payment history.
     * @param {number} [page]
     * @param {number} [pageSize]
     */
    async function fetchPaymentHistory(page = historyPage.value, pageSize = historyPageSize.value) {
        isLoading.value = true;
        try {
            const response = await api.getPaymentHistory(page, pageSize);
            if (response?.data) {
                const raw = response.data;
                // Support both array and paginated envelope { items, total }
                const items = Array.isArray(raw) ? raw : (raw.items ?? []);
                historyTotal.value = Array.isArray(raw) ? raw.length : (raw.total ?? 0);
                paymentHistory.value = SubscriptionAssembler.toPaymentEntityListFromRaw(items);
                historyPage.value = page;
            }
        } catch (error) {
            console.error('[SubscriptionStore] fetchPaymentHistory error:', error.message);
            errors.value.push({ code: 'FETCH_HISTORY_FAILED', message: error.message });
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Loads the active status alert from the backend.
     */
    async function fetchStatusAlert() {
        try {
            const response = await api.getStatusAlert();
            if (response?.data) {
                activeAlert.value = response.data;
            } else {
                activeAlert.value = null;
            }
        } catch (error) {
            // Silently ignore — alerts are non-critical
            console.warn('[SubscriptionStore] fetchStatusAlert:', error.message);
            activeAlert.value = null;
        }
    }

    /**
     * Loads IoT device billing details for COMPANY subscriptions.
     */
    async function fetchDeviceBilling() {
        if (!isCompany.value) return;
        try {
            const response = await api.getDeviceBilling();
            if (response?.data) {
                deviceBilling.value = response.data;
            }
        } catch (error) {
            console.error('[SubscriptionStore] fetchDeviceBilling error:', error.message);
        }
    }

    /**
     * Initiates a Stripe Checkout session for TECHNICIAN or HOMEOWNER.
     * Redirects the browser to Stripe on success.
     * @param {string} planId
     */
    async function startCheckout(planId) {
        isCheckoutLoading.value = true;
        errors.value = [];
        try {
            const command = new InitiateCheckoutCommand({
                planId,
                successUrl: `${window.location.origin}/subscriptions/management?checkout=success`,
                cancelUrl:  `${window.location.origin}/subscriptions/management?checkout=cancelled`,
            });
            const payload  = SubscriptionAssembler.toCheckoutPayload(command);
            const response = await api.initiateCheckout(payload);
            const url      = response?.data?.checkout_url ?? response?.data?.checkoutUrl;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL returned from server.');
            }
        } catch (error) {
            console.error('[SubscriptionStore] startCheckout error:', error.message);
            errors.value.push({ code: 'CHECKOUT_FAILED', message: error.message });
        } finally {
            isCheckoutLoading.value = false;
        }
    }

    /**
     * Initiates an enterprise Stripe Checkout session for COMPANY.
     * @param {string} planId
     */
    async function startEnterpriseCheckout(planId) {
        isCheckoutLoading.value = true;
        errors.value = [];
        try {
            const payload  = { plan_id: planId, success_url: `${window.location.origin}/subscriptions/management?checkout=success`, cancel_url: `${window.location.origin}/subscriptions/management?checkout=cancelled` };
            const response = await api.initiateEnterpriseCheckout(payload);
            const url      = response?.data?.checkout_url ?? response?.data?.checkoutUrl;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No enterprise checkout URL returned from server.');
            }
        } catch (error) {
            console.error('[SubscriptionStore] startEnterpriseCheckout error:', error.message);
            errors.value.push({ code: 'ENTERPRISE_CHECKOUT_FAILED', message: error.message });
        } finally {
            isCheckoutLoading.value = false;
        }
    }

    /**
     * Opens the Stripe Customer Portal for self-service billing management.
     */
    async function openStripePortal() {
        isPortalLoading.value = true;
        try {
            const returnUrl = `${window.location.origin}/subscriptions/management`;
            const response  = await api.getStripePortalUrl(returnUrl);
            const url       = response?.data?.portal_url ?? response?.data?.portalUrl;
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        } catch (error) {
            console.error('[SubscriptionStore] openStripePortal error:', error.message);
            errors.value.push({ code: 'PORTAL_FAILED', message: error.message });
        } finally {
            isPortalLoading.value = false;
        }
    }

    /**
     * Sends a deferred cancellation request.
     * @param {string} reason
     * @param {string} feedback
     */
    async function cancelSubscription(reason, feedback = '') {
        isCancelLoading.value = true;
        errors.value = [];
        try {
            const command  = new CancelSubscriptionCommand({ reason, feedback });
            const payload  = SubscriptionAssembler.toCancelPayload(command);
            await api.cancelSubscription(payload);
            // Refresh subscription to reflect cancelAtPeriodEnd = true
            await fetchSubscription();
        } catch (error) {
            console.error('[SubscriptionStore] cancelSubscription error:', error.message);
            errors.value.push({ code: 'CANCEL_FAILED', message: error.message });
        } finally {
            isCancelLoading.value = false;
        }
    }

    /**
     * Bootstraps all subscription data on page mount.
     */
    async function initialize() {
        await fetchSubscription();
        await Promise.allSettled([
            fetchPaymentHistory(),
            fetchStatusAlert(),
            fetchDeviceBilling(),
        ]);
    }

    // ─── Expose ───────────────────────────────────────────────────────────────

    return {
        // State
        subscription,
        paymentHistory,
        activeAlert,
        deviceBilling,
        isLoading,
        isCheckoutLoading,
        isCancelLoading,
        isPortalLoading,
        errors,
        historyPage,
        historyPageSize,
        historyTotal,

        // Getters
        businessRole,
        isHomeowner,
        isCompany,
        isTechnician,
        showQuotaTracker,
        showEnterpriseBilling,
        showPendingInstallationBanner,
        showQuotaWarning,
        isQuotaExhausted,
        quotaPercent,
        isActive,
        isInGracePeriod,
        planName,
        statusLabel,
        statusSeverity,

        // Actions
        fetchSubscription,
        fetchPaymentHistory,
        fetchStatusAlert,
        fetchDeviceBilling,
        startCheckout,
        startEnterpriseCheckout,
        openStripePortal,
        cancelSubscription,
        initialize,
    };
});

export default useSubscriptionStore;
