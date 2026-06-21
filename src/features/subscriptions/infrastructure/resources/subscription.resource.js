/**
 * SubscriptionResource
 * Mirrors the snake_case REST response from GET /api/v1/subscriptions/me.
 * All fields match exactly what the backend returns.
 */
export class SubscriptionResource {
    constructor(data = {}) {
        this.id                          = data.id ?? null;
        this.user_id                     = data.user_id ?? null;
        this.business_role               = data.business_role ?? null;
        this.plan_id                     = data.plan_id ?? null;
        this.plan_name                   = data.plan_name ?? null;
        this.plan_tier                   = data.plan_tier ?? null;
        this.status                      = data.status ?? null;
        this.price_per_month             = data.price_per_month ?? 0;
        this.current_period_start        = data.current_period_start ?? null;
        this.current_period_end          = data.current_period_end ?? null;
        this.stripe_subscription_id      = data.stripe_subscription_id ?? null;
        this.stripe_customer_id          = data.stripe_customer_id ?? null;
        this.cancel_at_period_end        = data.cancel_at_period_end ?? false;
        // HOMEOWNER
        this.monthly_requests_used       = data.monthly_requests_used ?? 0;
        this.monthly_requests_limit      = data.monthly_requests_limit ?? 2;
        // COMPANY
        this.active_device_count         = data.active_device_count ?? 0;
        this.price_per_device            = data.price_per_device ?? 0;
        this.projected_next_month_amount = data.projected_next_month_amount ?? 0;
        this.iot_installation_status     = data.iot_installation_status ?? null;
    }
}
