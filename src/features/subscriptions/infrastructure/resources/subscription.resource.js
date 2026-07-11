/**
 * SubscriptionResource
 * Mirrors the snake_case REST response from GET /api/v1/subscriptions/me.
 * Tolerant to both camelCase and PascalCase input keys.
 */
export class SubscriptionResource {
    constructor(data = {}) {
        this.subscriptionId          = data.subscriptionId ?? data.SubscriptionId ?? null;
        this.plan_type               = data.planType ?? data.PlanType ?? null;
        this.status                  = data.status ?? data.Status ?? null;
        this.billing_cycle           = data.billingCycle ?? data.BillingCycle ?? null;
        this.period_end              = data.periodEnd ?? data.PeriodEnd ?? null;
        this.cancel_at_period_end    = data.cancelAtPeriodEnd ?? data.CancelAtPeriodEnd ?? false;
        this.monthly_requests_used   = data.monthlyRequestsUsed ?? data.MonthlyRequestsUsed ?? 0;
        this.monthly_requests_limit  = data.monthlyRequestsLimit ?? data.MonthlyRequestsLimit ?? null;
        this.grace_period_ends_at    = data.gracePeriodEndsAt ?? data.GracePeriodEndsAt ?? null;
    }
}
