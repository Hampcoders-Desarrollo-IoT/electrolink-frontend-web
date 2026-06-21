import { SubscriptionEntity } from '../../domain/models/subscription.entity.js';
import { SubscriptionResource } from '../resources/subscription.resource.js';
import { PaymentRecordEntity } from '../../domain/models/payment-record.entity.js';

/**
 * SubscriptionAssembler
 * Converts snake_case API responses to camelCase domain entities
 * and transforms command objects into API-ready payloads.
 */
export class SubscriptionAssembler {

    /**
     * Creates a SubscriptionResource from a raw Axios response.
     * @param {import('axios').AxiosResponse} response
     * @returns {SubscriptionResource|null}
     */
    static toResourceFromResponse(response) {
        if (response?.status !== 200 && response?.status !== 201) {
            console.error(`SubscriptionAssembler: Unexpected status ${response?.status}`);
            return null;
        }
        return new SubscriptionResource(response.data);
    }

    /**
     * Converts a SubscriptionResource to a SubscriptionEntity (camelCase).
     * @param {SubscriptionResource} resource
     * @returns {SubscriptionEntity}
     */
    static toEntityFromResource(resource) {
        return new SubscriptionEntity({
            id:                       resource.id,
            userId:                   resource.user_id,
            businessRole:             resource.business_role,
            planId:                   resource.plan_id,
            planName:                 resource.plan_name,
            planTier:                 resource.plan_tier,
            status:                   resource.status,
            pricePerMonth:            resource.price_per_month,
            currentPeriodStart:       resource.current_period_start,
            currentPeriodEnd:         resource.current_period_end,
            stripeSubscriptionId:     resource.stripe_subscription_id,
            stripeCustomerId:         resource.stripe_customer_id,
            cancelAtPeriodEnd:        resource.cancel_at_period_end,
            monthlyRequestsUsed:      resource.monthly_requests_used,
            monthlyRequestsLimit:     resource.monthly_requests_limit,
            activeDeviceCount:        resource.active_device_count,
            pricePerDevice:           resource.price_per_device,
            projectedNextMonthAmount: resource.projected_next_month_amount,
            iotInstallationStatus:    resource.iot_installation_status,
        });
    }

    /**
     * Converts a raw payment record object (snake_case) to a PaymentRecordEntity.
     * @param {Object} raw
     * @returns {PaymentRecordEntity}
     */
    static toPaymentEntityFromRaw(raw) {
        return new PaymentRecordEntity({
            id:                    raw.id,
            subscriptionId:        raw.subscription_id,
            description:           raw.description,
            amount:                raw.amount,
            currency:              raw.currency,
            status:                raw.status,
            paidAt:                raw.paid_at,
            invoiceUrl:            raw.invoice_url,
            stripePaymentIntentId: raw.stripe_payment_intent_id,
        });
    }

    /**
     * Converts an array of raw payment records to PaymentRecordEntity array.
     * @param {Array<Object>} rawList
     * @returns {Array<PaymentRecordEntity>}
     */
    static toPaymentEntityListFromRaw(rawList) {
        if (!Array.isArray(rawList)) return [];
        return rawList.map(raw => SubscriptionAssembler.toPaymentEntityFromRaw(raw));
    }

    /**
     * Converts an InitiateCheckoutCommand to a backend-ready payload.
     * @param {import('../../domain/commands/initiate-checkout.command.js').InitiateCheckoutCommand} command
     * @returns {Object}
     */
    static toCheckoutPayload(command) {
        const payload = {
            plan_id:     command.planId,
            success_url: command.successUrl,
            cancel_url:  command.cancelUrl,
        };
        if (command.couponCode) {
            payload.coupon_code = command.couponCode;
        }
        return payload;
    }

    /**
     * Converts a CancelSubscriptionCommand to a backend-ready payload.
     * @param {import('../../domain/commands/cancel-subscription.command.js').CancelSubscriptionCommand} command
     * @returns {Object}
     */
    static toCancelPayload(command) {
        return {
            reason:   command.reason,
            feedback: command.feedback,
        };
    }
}
