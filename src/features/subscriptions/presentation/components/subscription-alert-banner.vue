<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

/**
 * Resolves the correct alert config based on alert type and subscription state.
 * Priority: explicit API alert > derived subscription state alerts.
 */
const alertConfig = computed(() => {
    const apiAlert = store.activeAlert;
    const sub      = store.subscription;

    // API-driven alerts take precedence
    if (apiAlert?.type === 'PAYMENT_FAILED') {
        return {
            type:    'danger',
            icon:    'pi-credit-card',
            title:   'Payment Failed',
            message: apiAlert.message ?? 'Your last payment could not be processed. Please update your billing information.',
            cta:     'Update Billing',
            ctaAction: () => store.openStripePortal(),
        };
    }

    if (apiAlert?.type === 'MONTHLY_LIMIT_REACHED' || store.isQuotaExhausted) {
        return {
            type:    'warn',
            icon:    'pi-exclamation-triangle',
            title:   'Monthly Limit Reached',
            message: 'You have used all your monthly service requests. Upgrade to Premium for unlimited access.',
            cta:     null,
            ctaAction: null,
        };
    }

    // COMPANY — pending IoT installation
    if (apiAlert?.type === 'PENDING_INSTALLATION' || store.showPendingInstallationBanner) {
        return {
            type:    'info',
            icon:    'pi-microchip',
            title:   'IoT Installation Pending',
            message: 'Your payment was processed successfully. Device monitoring will be activated once the physical IoT hardware is installed at your facility.',
            cta:     null,
            ctaAction: null,
        };
    }

    // Grace period (payment retrying)
    if (store.isInGracePeriod) {
        return {
            type:    'warn',
            icon:    'pi-clock',
            title:   'Grace Period Active',
            message: 'We are retrying your payment. Your subscription remains active. Please update your payment method to avoid interruption.',
            cta:     'Manage Billing',
            ctaAction: () => store.openStripePortal(),
        };
    }

    return null;
});

const alertClasses = computed(() => {
    const t = alertConfig.value?.type ?? 'info';
    return {
        'sub-alert--info':   t === 'info',
        'sub-alert--warn':   t === 'warn',
        'sub-alert--danger': t === 'danger',
    };
});

const iconClasses = computed(() => {
    const t = alertConfig.value?.type ?? 'info';
    return {
        'alert-icon--info':   t === 'info',
        'alert-icon--warn':   t === 'warn',
        'alert-icon--danger': t === 'danger',
    };
});
</script>

<template>
    <Transition name="fade-slide">
        <div
            v-if="alertConfig"
            :class="['sub-alert', alertClasses]"
        >
            <div class="alert-icon-wrap" :class="iconClasses">
                <i :class="`pi ${alertConfig.icon}`"></i>
            </div>
            <div class="alert-body">
                <p class="alert-title">{{ alertConfig.title }}</p>
                <p class="alert-message">{{ alertConfig.message }}</p>
            </div>
            <pv-button
                v-if="alertConfig.cta"
                :label="alertConfig.cta"
                size="small"
                class="alert-cta"
                :loading="store.isPortalLoading"
                @click="alertConfig.ctaAction?.()"
            />
        </div>
    </Transition>
</template>

<style scoped>
.sub-alert {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 10px;
    border: 1px solid transparent;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
}

/* Variants */
.sub-alert--info {
    background: rgba(25, 120, 229, 0.06);
    border-color: rgba(25, 120, 229, 0.2);
    color: #1e40af;
}

.sub-alert--warn {
    background: rgba(245, 158, 11, 0.07);
    border-color: rgba(245, 158, 11, 0.25);
    color: #92400e;
}

.sub-alert--danger {
    background: rgba(239, 68, 68, 0.07);
    border-color: rgba(239, 68, 68, 0.2);
    color: #991b1b;
}

/* Icon */
.alert-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
}

.alert-icon--info   { background: rgba(25, 120, 229, 0.12); color: var(--el-custom); }
.alert-icon--warn   { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.alert-icon--danger { background: rgba(239, 68, 68, 0.12);  color: var(--el-danger); }

/* Body */
.alert-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.alert-title {
    font-size: 0.875rem;
    font-weight: 700;
    margin: 0;
}

.alert-message {
    font-size: 0.82rem;
    margin: 0;
    line-height: 1.45;
    opacity: 0.9;
}

.alert-cta {
    flex-shrink: 0;
    align-self: center;
    font-size: 0.8rem;
}

/* Transition */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.35s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
