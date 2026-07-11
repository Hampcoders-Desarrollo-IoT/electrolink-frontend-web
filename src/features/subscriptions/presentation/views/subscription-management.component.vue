<script setup>
import { onMounted, computed } from 'vue';
import { useRoute }            from 'vue-router';
import { useSubscriptionStore }       from '../../application/subscription.store.js';
import CurrentPlanSection             from '../components/current-plan-section.vue';
import UsageQuotaTracker              from '../components/usage-quota-tracker.vue';
import PlanPricingGrid                from '../components/plan-pricing-grid.vue';

const store = useSubscriptionStore();
const route = useRoute();

const checkoutStatus = computed(() => route.query.checkout ?? null);

onMounted(async () => {
    await store.initialize();

    if (checkoutStatus.value === 'success') {
        const raw = sessionStorage.getItem('electrolink_pending_plan');
        if (raw) {
            try {
                const { planType, billingCycle } = JSON.parse(raw);
                await store.createSubscription(planType, billingCycle);
            } catch {
                // fallback: just refresh
                await store.fetchSubscription();
            } finally {
                sessionStorage.removeItem('electrolink_pending_plan');
            }
        } else {
            await store.fetchSubscription();
        }
    }
});
</script>

<template>
    <div class="sub-management-page">
        <!-- Page Title -->
        <div class="page-title-bar">
            <div class="page-title-left">
                <h1 class="page-title">Subscription Management</h1>
            </div>
            <div class="page-title-actions">
                <pv-button
                    v-if="store.subscription?.subscriptionId"
                    label="Manage Billing"
                    icon="pi pi-external-link"
                    :loading="store.isPortalLoading"
                    class="portal-btn"
                    outlined
                    @click="store.openStripePortal()"
                />
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="store.isLoading && !store.subscription" class="loading-state">
            <div class="loading-skeleton-grid">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
            <div class="skeleton-section"></div>
        </div>

        <template v-else>
            <!-- Checkout return toast feedback -->
            <Transition name="fade-slide">
                <div v-if="checkoutStatus === 'success'" class="return-banner return-banner--success">
                    <i class="pi pi-check-circle"></i>
                    <span>Your subscription was activated successfully. Welcome to your new plan!</span>
                </div>
            </Transition>
            <Transition name="fade-slide">
                <div v-if="checkoutStatus === 'cancelled'" class="return-banner return-banner--info">
                    <i class="pi pi-info-circle"></i>
                    <span>Checkout was cancelled. You can upgrade at any time.</span>
                </div>
            </Transition>

            <!-- Top Section: Current Plan + Contextual Right Panel -->
            <div class="top-grid">
                <!-- LEFT: Current Plan Card -->
                <CurrentPlanSection />

                <!-- RIGHT: Quota Tracker for HomeOwner BASIC -->
                <UsageQuotaTracker v-if="store.showQuotaTracker" />

                <!-- Fallback -->
                <div v-else class="placeholder-card"></div>
            </div>

            <!-- Available Plans Grid -->
            <PlanPricingGrid />
        </template>
    </div>
</template>

<style scoped>
.sub-management-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem 2.5rem;
    max-width: 1280px;
    margin: 0 auto;
    width: 100%;
}

/* Page Title Bar */
.page-title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.page-title {
    font-size: 1.625rem;
    font-weight: 800;
    color: var(--el-primary);
    margin: 0;
}

.portal-btn {
    font-weight: 600;
    font-size: 0.875rem;
}

/* Loading Skeleton */
.loading-state {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: pulse 1.5s infinite;
}

.loading-skeleton-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
}

.skeleton-card {
    height: 220px;
    border-radius: 12px;
    background: linear-gradient(90deg,
        rgba(169, 177, 186, 0.15) 25%,
        rgba(169, 177, 186, 0.3) 50%,
        rgba(169, 177, 186, 0.15) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-section {
    height: 400px;
    border-radius: 12px;
    background: linear-gradient(90deg,
        rgba(169, 177, 186, 0.15) 25%,
        rgba(169, 177, 186, 0.3) 50%,
        rgba(169, 177, 186, 0.15) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Return Banner */
.return-banner {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.25rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 500;
}

.return-banner--success {
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    color: #065f46;
}

.return-banner--success .pi {
    color: var(--el-success);
    font-size: 1.1rem;
}

.return-banner--info {
    background: rgba(25, 120, 229, 0.06);
    border: 1px solid rgba(25, 120, 229, 0.2);
    color: #1e40af;
}

.return-banner--info .pi {
    color: var(--el-custom);
    font-size: 1.1rem;
}

/* Top Grid: 2-column layout */
.top-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    align-items: start;
}

/* Technician Activation Card */
.tech-activation-card {
    background: white;
    border-radius: 12px;
    border: 1.5px dashed rgba(169, 177, 186, 0.4);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
}

.tech-activation-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(25, 120, 229, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: var(--el-custom);
}

.tech-activation-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--el-primary);
    margin: 0;
}

.tech-activation-desc {
    font-size: 0.875rem;
    color: var(--el-gray);
    margin: 0;
    line-height: 1.5;
    max-width: 320px;
}

/* Placeholder */
.placeholder-card {
    min-height: 180px;
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.35s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* Responsive */
@media (max-width: 900px) {
    .sub-management-page {
        padding: 1.5rem 1.25rem;
    }

    .top-grid {
        grid-template-columns: 1fr;
    }

    .loading-skeleton-grid {
        grid-template-columns: 1fr;
    }
}
</style>
