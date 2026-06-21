<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

const used  = computed(() => store.subscription?.monthlyRequestsUsed  ?? 0);
const limit = computed(() => store.subscription?.monthlyRequestsLimit ?? 2);
const pct   = computed(() => store.quotaPercent);

const progressSeverity = computed(() => {
    if (pct.value >= 100) return 'danger';
    if (pct.value >= 50)  return 'warning';
    return 'primary';
});

const progressColor = computed(() => {
    if (pct.value >= 100) return 'var(--el-danger)';
    if (pct.value >= 50)  return '#f59e0b';
    return 'var(--el-custom)';
});
</script>

<template>
    <div class="quota-tracker-card">
        <div class="quota-header">
            <div class="quota-title-group">
                <h3 class="quota-title">Monthly Service Requests</h3>
                <p class="quota-subtitle">Usage resets on the 1st of every month.</p>
            </div>
            <div class="quota-counter">
                <span class="quota-used">{{ used }}</span>
                <span class="quota-separator">/</span>
                <span class="quota-limit">{{ limit }}</span>
            </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-wrapper">
            <div class="progress-track">
                <div
                    class="progress-fill"
                    :style="{ width: `${pct}%`, backgroundColor: progressColor }"
                ></div>
            </div>
            <span class="progress-label">{{ pct }}% Quota Used</span>
        </div>

        <!-- Warning Banner (>= 1 request used) -->
        <Transition name="fade-slide">
            <div
                v-if="store.showQuotaWarning && !store.isQuotaExhausted"
                class="quota-alert quota-alert--warn"
            >
                <i class="pi pi-exclamation-triangle alert-icon"></i>
                <span>You are approaching your limit. Upgrade to Premium for unlimited requests.</span>
            </div>
        </Transition>

        <!-- Exhausted Banner -->
        <Transition name="fade-slide">
            <div
                v-if="store.isQuotaExhausted"
                class="quota-alert quota-alert--danger"
            >
                <i class="pi pi-times-circle alert-icon"></i>
                <span>Monthly limit reached. Upgrade to Premium to continue submitting requests.</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.quota-tracker-card {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(169, 177, 186, 0.2);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.06);
}

.quota-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.quota-title-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.quota-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--el-primary);
    margin: 0;
}

.quota-subtitle {
    font-size: 0.8rem;
    color: var(--el-gray);
    margin: 0;
}

.quota-counter {
    display: flex;
    align-items: baseline;
    gap: 0.125rem;
    flex-shrink: 0;
}

.quota-used {
    font-size: 2rem;
    font-weight: 800;
    color: var(--el-primary);
    line-height: 1;
}

.quota-separator {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--el-warm-gray);
    margin: 0 0.125rem;
}

.quota-limit {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--el-warm-gray);
}

/* Custom Progress Bar */
.progress-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
}

.progress-track {
    width: 100%;
    height: 8px;
    background: rgba(169, 177, 186, 0.2);
    border-radius: 99px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease;
}

.progress-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--el-gray);
    text-align: right;
}

/* Alert Banners */
.quota-alert {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.4;
}

.quota-alert--warn {
    background: rgba(245, 158, 11, 0.08);
    border: 1px solid rgba(245, 158, 11, 0.3);
    color: #92400e;
}

.quota-alert--danger {
    background: rgba(239, 68, 68, 0.07);
    border: 1px solid rgba(239, 68, 68, 0.25);
    color: #991b1b;
}

.alert-icon {
    font-size: 1rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
    color: #f59e0b;
}

.quota-alert--danger .alert-icon {
    color: var(--el-danger);
}

/* Transitions */
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
