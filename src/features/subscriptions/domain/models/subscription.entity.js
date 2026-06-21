/**
 * Subscription Entity
 * Represents the user's current subscription state.
 * Supports polymorphic fields for HOMEOWNER, COMPANY, and TECHNICIAN roles.
 */
export class SubscriptionEntity {
    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {string} data.userId
     * @param {string} data.businessRole       - 'HOMEOWNER' | 'COMPANY' | 'TECHNICIAN'
     * @param {string} data.planId
     * @param {string} data.planName
     * @param {string} data.planTier           - 'BASIC' | 'PREMIUM' | 'ENTERPRISE_BASIC' | 'ENTERPRISE_PRO' | 'TECHNICIAN_STANDARD'
     * @param {string} data.status             - 'ACTIVE' | 'PENDING_INSTALLATION' | 'GRACE_PERIOD' | 'CANCELLED' | 'TRIALING'
     * @param {number|null} data.pricePerMonth
     * @param {string|null} data.currentPeriodStart - ISO date string
     * @param {string|null} data.currentPeriodEnd   - ISO date string
     * @param {string|null} data.stripeSubscriptionId
     * @param {string|null} data.stripeCustomerId
     * @param {boolean} data.cancelAtPeriodEnd
     * // HOMEOWNER-specific fields
     * @param {number|null} data.monthlyRequestsUsed
     * @param {number|null} data.monthlyRequestsLimit
     * // COMPANY-specific fields
     * @param {number|null} data.activeDeviceCount
     * @param {number|null} data.pricePerDevice
     * @param {number|null} data.projectedNextMonthAmount
     * @param {string|null} data.iotInstallationStatus - 'PENDING' | 'COMPLETED' | null
     */
    constructor(data = {}) {
        this.id                       = data.id ?? null;
        this.userId                   = data.userId ?? null;
        this.businessRole             = data.businessRole ?? null;
        this.planId                   = data.planId ?? null;
        this.planName                 = data.planName ?? 'Plan Básico';
        this.planTier                 = data.planTier ?? 'BASIC';
        this.status                   = data.status ?? 'ACTIVE';
        this.pricePerMonth            = data.pricePerMonth ?? 0;
        this.currentPeriodStart       = data.currentPeriodStart ?? null;
        this.currentPeriodEnd         = data.currentPeriodEnd ?? null;
        this.stripeSubscriptionId     = data.stripeSubscriptionId ?? null;
        this.stripeCustomerId         = data.stripeCustomerId ?? null;
        this.cancelAtPeriodEnd        = data.cancelAtPeriodEnd ?? false;

        // HOMEOWNER-specific usage counters
        this.monthlyRequestsUsed      = data.monthlyRequestsUsed ?? 0;
        this.monthlyRequestsLimit     = data.monthlyRequestsLimit ?? 2;

        // COMPANY-specific device billing
        this.activeDeviceCount        = data.activeDeviceCount ?? 0;
        this.pricePerDevice           = data.pricePerDevice ?? 0;
        this.projectedNextMonthAmount = data.projectedNextMonthAmount ?? 0;
        this.iotInstallationStatus    = data.iotInstallationStatus ?? null;
    }

    /** Whether the subscription is fully active */
    get isActive() {
        return this.status === 'ACTIVE';
    }

    /** Whether the HOMEOWNER is approaching or at the monthly request quota */
    get isNearQuota() {
        if (this.businessRole !== 'HOMEOWNER' || this.monthlyRequestsLimit === 0) return false;
        return this.monthlyRequestsUsed >= 1;
    }

    /** Whether the HOMEOWNER has exhausted their monthly quota */
    get isQuotaExhausted() {
        if (this.businessRole !== 'HOMEOWNER') return false;
        return this.monthlyRequestsUsed >= this.monthlyRequestsLimit;
    }

    /** Quota usage as a percentage (0–100) */
    get quotaUsagePercent() {
        if (!this.monthlyRequestsLimit || this.monthlyRequestsLimit === 0) return 0;
        return Math.min(100, Math.round((this.monthlyRequestsUsed / this.monthlyRequestsLimit) * 100));
    }

    /** Whether the COMPANY subscription is pending IoT hardware installation */
    get isPendingInstallation() {
        return this.status === 'PENDING_INSTALLATION' || this.iotInstallationStatus === 'PENDING';
    }

    /** Whether the subscription is in a grace period after payment failure */
    get isInGracePeriod() {
        return this.status === 'GRACE_PERIOD';
    }

    /** Whether the plan is a free tier */
    get isFreeTier() {
        return this.pricePerMonth === 0;
    }

    /** Display label for subscription status badge */
    get statusLabel() {
        const labels = {
            ACTIVE:               'Active',
            PENDING_INSTALLATION: 'Pending Installation',
            GRACE_PERIOD:         'Grace Period',
            CANCELLED:            'Cancelled',
            TRIALING:             'Trial',
        };
        return labels[this.status] ?? this.status;
    }

    /** Severity for PrimeVue Tag component */
    get statusSeverity() {
        const map = {
            ACTIVE:               'success',
            PENDING_INSTALLATION: 'info',
            GRACE_PERIOD:         'warn',
            CANCELLED:            'danger',
            TRIALING:             'secondary',
        };
        return map[this.status] ?? 'secondary';
    }
}
