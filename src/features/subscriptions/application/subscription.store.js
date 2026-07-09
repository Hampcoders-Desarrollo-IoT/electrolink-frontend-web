import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { SubscriptionApiService } from '../infrastructure/services/subscription-api.service.js';
import { SubscriptionAssembler } from '../infrastructure/assembler/subscription.assembler.js';
import { InitiateCheckoutCommand } from '../domain/commands/initiate-checkout.command.js';
import { CancelSubscriptionCommand } from '../domain/commands/cancel-subscription.command.js';
import { CreateSubscriptionCommand } from '../domain/commands/create-subscription.command.js';
import { ActivateSubscriptionCommand } from '../domain/commands/activate-subscription.command.js';
import { DegradeSubscriptionCommand } from '../domain/commands/degrade-subscription.command.js';
import { SubscriptionEntity } from '../domain/models/subscription.entity.js';
import useIamStore from '../../iam/application/iam.store.js';

const api = new SubscriptionApiService();

/**
 * useSubscriptionStore
 * Centralized Pinia store for subscription state and role-based computed getters.
 */
export const useSubscriptionStore = defineStore('subscriptions', () => {

    // ─── State ────────────────────────────────────────────────────────────────

    /** @type {import('vue').Ref<import('../domain/models/subscription.entity.js').SubscriptionEntity|null>} */
    const subscription = ref(null);

    const isLoading          = ref(false);
    const isCheckoutLoading  = ref(false);
    const isCancelLoading    = ref(false);
    const isPortalLoading    = ref(false);
    const isCreatingLoading  = ref(false);
    const isActivatingLoading = ref(false);
    const isDegradingLoading  = ref(false);
    const errors             = ref([]);

    // ─── Getters (Computed) ───────────────────────────────────────────────────

    /** Current business role inferred from JWT via roleSubjectId */
    const businessRole = computed(() => {
        const iamStore = useIamStore();
        const subId = iamStore.roleSubjectId;
        if (!subId) return null;
        const prefix = subId.split('-')[0];
        const roleMap = { tech: 'Technician', owner: 'HomeOwner', company: 'Company' };
        return roleMap[prefix] ?? null;
    });

    /** Whether the current user is a HOMEOWNER */
    const isHomeowner = computed(() => businessRole.value === 'HomeOwner');

    /** Whether the current user is a COMPANY */
    const isCompany = computed(() => businessRole.value === 'Company');

    /** Whether the current user is a TECHNICIAN */
    const isTechnician = computed(() => businessRole.value === 'Technician');

    /** Whether a HOMEOWNER on BASIC plan should see the quota tracker */
    const showQuotaTracker = computed(() =>
        isHomeowner.value && subscription.value?.planType === 'BASIC'
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
    const planName = computed(() => {
        if (!subscription.value?.planType) return '—';
        switch (subscription.value.planType) {
            case 'BASIC': return 'Plan Básico';
            case 'PREMIUM': return 'Plan Premium';
            case 'ENTERPRISE_BASIC': return 'Enterprise Basic';
            case 'ENTERPRISE_PRO': return 'Enterprise Pro';
            default: return subscription.value.planType;
        }
    });

    /** Display-ready plan status label */
    const statusLabel = computed(() => subscription.value?.statusLabel ?? '—');

    /** PrimeVue severity for status tag */
    const statusSeverity = computed(() => subscription.value?.statusSeverity ?? 'secondary');

    // ─── Actions ──────────────────────────────────────────────────────────────

    /**
     * Loads the current user's subscription data from the API.
     * Falls back to JWT roleSubjectId if the API call fails.
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
            console.warn('[SubscriptionStore] fetchSubscription error:', error.message);
            errors.value.push({ code: 'FETCH_SUBSCRIPTION_FAILED', message: error.message });
            subscription.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Initiates a Stripe Checkout session.
     * Redirects the browser to Stripe on success.
     * @param {string} planType
     * @param {string} billingCycle
     */
    async function startCheckout(planType, billingCycle) {
        isCheckoutLoading.value = true;
        errors.value = [];
        try {
            const command = new InitiateCheckoutCommand({
                planType,
                billingCycle,
                successUrl: `${window.location.origin}/subscriptions/management?checkout=success`,
                cancelUrl:  `${window.location.origin}/subscriptions/management?checkout=cancelled`,
            });
            const payload  = SubscriptionAssembler.toCheckoutPayload(command);
            const response = await api.initiateCheckout(payload);
            const url      = response?.data?.url ?? response?.data?.checkout_url ?? response?.data?.checkoutUrl;
            if (url) {
                sessionStorage.setItem('electrolink_pending_plan', JSON.stringify({ planType, billingCycle }));
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
     * Opens the Stripe Customer Portal for self-service billing management.
     */
    async function openStripePortal() {
        isPortalLoading.value = true;
        try {
            const returnUrl = `${window.location.origin}/subscriptions/management`;
            const payload   = SubscriptionAssembler.toPortalPayload(returnUrl);
            const response  = await api.getStripePortalUrl(payload);
            const url       = response?.data?.url ?? response?.data?.portal_url ?? response?.data?.portalUrl;
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
            await fetchSubscription();
        } catch (error) {
            console.error('[SubscriptionStore] cancelSubscription error:', error.message);
            errors.value.push({ code: 'CANCEL_FAILED', message: error.message });
        } finally {
            isCancelLoading.value = false;
        }
    }

    /**
     * Creates a new subscription.
     * @param {string} planType
     * @param {string} billingCycle
     */
    async function createSubscription(planType, billingCycle) {
        isCreatingLoading.value = true;
        errors.value = [];
        try {
            const command = new CreateSubscriptionCommand({ planType, billingCycle });
            const payload = SubscriptionAssembler.toCreatePayload(command);
            await api.createSubscription(payload);
            await fetchSubscription();
        } catch (error) {
            console.error('[SubscriptionStore] createSubscription error:', error.message);
            errors.value.push({ code: 'CREATE_FAILED', message: error.message });
        } finally {
            isCreatingLoading.value = false;
        }
    }

    /**
     * Reactivates a cancelled subscription.
     */
    async function activateSubscription() {
        isActivatingLoading.value = true;
        errors.value = [];
        try {
            const command = new ActivateSubscriptionCommand({
                subscriptionId: subscription.value?.subscriptionId,
            });
            const payload = SubscriptionAssembler.toActivatePayload(command);
            await api.activateSubscription(payload);
            await fetchSubscription();
        } catch (error) {
            console.error('[SubscriptionStore] activateSubscription error:', error.message);
            errors.value.push({ code: 'ACTIVATE_FAILED', message: error.message });
        } finally {
            isActivatingLoading.value = false;
        }
    }

    /**
     * Degrades a subscription back to free tier.
     */
    async function degradeSubscription() {
        isDegradingLoading.value = true;
        errors.value = [];
        try {
            const command = new DegradeSubscriptionCommand({
                subscriptionId: subscription.value?.subscriptionId,
            });
            const payload = SubscriptionAssembler.toDegradePayload(command);
            await api.degradeSubscription(payload);
            await fetchSubscription();
        } catch (error) {
            console.error('[SubscriptionStore] degradeSubscription error:', error.message);
            errors.value.push({ code: 'DEGRADE_FAILED', message: error.message });
        } finally {
            isDegradingLoading.value = false;
        }
    }

    /**
     * Bootstraps subscription data on page mount.
     */
    async function initialize() {
        await fetchSubscription();
    }

    // ─── Expose ───────────────────────────────────────────────────────────────

    return {
        subscription,
        isLoading,
        isCheckoutLoading,
        isCancelLoading,
        isPortalLoading,
        isCreatingLoading,
        isActivatingLoading,
        isDegradingLoading,
        errors,

        businessRole,
        isHomeowner,
        isCompany,
        isTechnician,
        showQuotaTracker,
        showQuotaWarning,
        isQuotaExhausted,
        quotaPercent,
        isActive,
        isInGracePeriod,
        planName,
        statusLabel,
        statusSeverity,

        fetchSubscription,
        startCheckout,
        openStripePortal,
        cancelSubscription,
        createSubscription,
        activateSubscription,
        degradeSubscription,
        initialize,
    };
});

export default useSubscriptionStore;
