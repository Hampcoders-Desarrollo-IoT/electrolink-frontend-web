import { SubscriptionEntity } from '../../domain/models/subscription.entity.js';
import { SubscriptionResource } from '../resources/subscription.resource.js';

/**
 * SubscriptionAssembler
 * Converts API responses to domain entities and transforms command objects
 * into API-ready payloads.
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
     * Converts a SubscriptionResource to a SubscriptionEntity (camelCase domain model).
     * The API already returns planType and status in UPPERCASE, so no .toUpperCase() needed.
     * @param {SubscriptionResource} resource
     * @returns {SubscriptionEntity}
     */
    static toEntityFromResource(resource) {
        return new SubscriptionEntity({
            subscriptionId:       resource.subscriptionId,
            planType:             resource.plan_type,
            status:               resource.status,
            billingCycle:         resource.billing_cycle,
            periodEnd:            resource.period_end,
            cancelAtPeriodEnd:    resource.cancel_at_period_end,
            monthlyRequestsUsed:  resource.monthly_requests_used,
            monthlyRequestsLimit: resource.monthly_requests_limit,
            gracePeriodEndsAt:    resource.grace_period_ends_at,
        });
    }

    /**
     * Converts an InitiateCheckoutCommand to a backend-ready payload (camelCase keys).
     * @param {import('../../domain/commands/initiate-checkout.command.js').InitiateCheckoutCommand} command
     * @returns {Object}
     */
    static toCheckoutPayload(command) {
        const payload = {
            planType:     command.planType,
            billingCycle: command.billingCycle,
            successUrl:   command.successUrl,
            cancelUrl:    command.cancelUrl,
        };
        if (command.couponCode) {
            payload.couponCode = command.couponCode;
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

    /**
     * Converts a CreateSubscriptionCommand to a backend-ready payload.
     * @param {import('../../domain/commands/create-subscription.command.js').CreateSubscriptionCommand} command
     * @returns {Object}
     */
    static toCreatePayload(command) {
        return {
            planType:     command.planType,
            billingCycle: command.billingCycle,
        };
    }

    /**
     * Converts an ActivateSubscriptionCommand to a backend-ready payload.
     * @param {import('../../domain/commands/activate-subscription.command.js').ActivateSubscriptionCommand} command
     * @returns {Object}
     */
    static toActivatePayload(command) {
        return {
            subscriptionId: command.subscriptionId,
        };
    }

    /**
     * Converts a DegradeSubscriptionCommand to a backend-ready payload.
     * @param {import('../../domain/commands/degrade-subscription.command.js').DegradeSubscriptionCommand} command
     * @returns {Object}
     */
    static toDegradePayload(command) {
        return {
            subscriptionId: command.subscriptionId,
        };
    }

    /**
     * Converts a return URL to a backend-ready portal payload.
     * @param {string} returnUrl
     * @returns {Object}
     */
    static toPortalPayload(returnUrl) {
        return {
            returnUrl,
        };
    }
}
