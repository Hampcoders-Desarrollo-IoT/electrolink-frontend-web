/**
 * Subscription Entity
 * Represents the user's current subscription state as returned by
 * GET /api/v1/subscriptions/me.
 */
export class SubscriptionEntity {
    /**
     * @param {Object} data
     * @param {string|null} data.subscriptionId
     * @param {string} data.planType           - 'BASIC' | 'PREMIUM' | 'ENTERPRISE_BASIC' | 'ENTERPRISE_PRO'
     * @param {string} data.status             - 'ACTIVE' | 'GRACE_PERIOD' | 'CANCELLED'
     * @param {string|null} data.billingCycle
     * @param {string|null} data.periodEnd
     * @param {boolean} data.cancelAtPeriodEnd
     * @param {number} data.monthlyRequestsUsed
     * @param {number} data.monthlyRequestsLimit
     * @param {string|null} data.gracePeriodEndsAt
     */
    constructor(data = {}) {
        this.subscriptionId        = data.subscriptionId ?? null;
        this.planType              = data.planType ?? 'BASIC';
        this.status                = data.status ?? 'ACTIVE';
        this.billingCycle          = data.billingCycle ?? null;
        this.periodEnd             = data.periodEnd ?? null;
        this.cancelAtPeriodEnd     = data.cancelAtPeriodEnd ?? false;
        this.monthlyRequestsUsed   = data.monthlyRequestsUsed ?? 0;
        this.monthlyRequestsLimit  = data.monthlyRequestsLimit ?? 2;
        this.gracePeriodEndsAt     = data.gracePeriodEndsAt ?? null;
    }

    /** Whether the subscription is fully active */
    get isActive() {
        return this.status === 'ACTIVE';
    }

    /** Whether the subscription is in a grace period after payment failure */
    get isInGracePeriod() {
        return this.status === 'GRACE_PERIOD';
    }

    /** Whether the plan is a free tier (monthlyRequestsLimit === 0 indicates unlimited for paid plans) */
    get isFreeTier() {
        return this.planType === 'BASIC' && !this.billingCycle;
    }

    /** Whether the HOMEOWNER is approaching or at the monthly request quota */
    get isNearQuota() {
        if (this.monthlyRequestsLimit === 0) return false;
        return this.monthlyRequestsUsed >= 1;
    }

    /** Whether the HOMEOWNER has exhausted their monthly quota */
    get isQuotaExhausted() {
        return this.monthlyRequestsUsed >= this.monthlyRequestsLimit;
    }

    /** Quota usage as a percentage (0–100) */
    get quotaUsagePercent() {
        if (!this.monthlyRequestsLimit || this.monthlyRequestsLimit === 0) return 0;
        return Math.min(100, Math.round((this.monthlyRequestsUsed / this.monthlyRequestsLimit) * 100));
    }

    /** Display label for subscription status badge */
    get statusLabel() {
        const labels = {
            ACTIVE:       'Active',
            GRACE_PERIOD: 'Grace Period',
            CANCELLED:    'Cancelled',
        };
        return labels[this.status] ?? this.status;
    }

    /** Severity for PrimeVue Tag component */
    get statusSeverity() {
        const map = {
            ACTIVE:       'success',
            GRACE_PERIOD: 'warn',
            CANCELLED:    'danger',
        };
        return map[this.status] ?? 'secondary';
    }
}
