<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

const sub = computed(() => store.subscription);

const pricePerDevice = computed(() =>
    `S/ ${Number(sub.value?.pricePerDevice ?? 0).toFixed(2)}`
);

const projectedAmount = computed(() =>
    `S/ ${Number(sub.value?.projectedNextMonthAmount ?? 0).toFixed(2)}`
);

const billingItems = computed(() => [
    {
        label:   'Active IoT Devices',
        value:   sub.value?.activeDeviceCount ?? 0,
        icon:    'pi-microchip',
        accent:  false,
    },
    {
        label:   'Price per Device / Month',
        value:   pricePerDevice.value,
        icon:    'pi-tag',
        accent:  false,
    },
    {
        label:   'Projected Next Month',
        value:   projectedAmount.value,
        icon:    'pi-calculator',
        accent:  true,
    },
]);
</script>

<template>
    <div class="enterprise-billing-card">
        <div class="billing-header">
            <div class="billing-title-group">
                <div class="billing-icon-wrapper">
                    <i class="pi pi-chart-line"></i>
                </div>
                <div>
                    <h3 class="billing-title">Dynamic Billing</h3>
                    <p class="billing-subtitle">Based on active IoT device count</p>
                </div>
            </div>
        </div>

        <div class="billing-metrics">
            <div
                v-for="item in billingItems"
                :key="item.label"
                :class="['billing-metric', { 'billing-metric--accent': item.accent }]"
            >
                <div class="metric-icon-wrap">
                    <i :class="`pi ${item.icon} metric-icon`"></i>
                </div>
                <div class="metric-content">
                    <span class="metric-label">{{ item.label }}</span>
                    <span :class="['metric-value', { 'metric-value--accent': item.accent }]">
                        {{ item.value }}
                    </span>
                </div>
            </div>
        </div>

        <div class="billing-footer">
            <i class="pi pi-info-circle"></i>
            <span>Billing is calculated on the 1st of each month based on active device count.</span>
        </div>
    </div>
</template>

<style scoped>
.enterprise-billing-card {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(169, 177, 186, 0.2);
    padding: 1.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.06);
}

.billing-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.billing-title-group {
    display: flex;
    align-items: center;
    gap: 0.875rem;
}

.billing-icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: rgba(25, 120, 229, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-custom);
    font-size: 1.1rem;
    flex-shrink: 0;
}

.billing-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--el-primary);
    margin: 0;
}

.billing-subtitle {
    font-size: 0.78rem;
    color: var(--el-gray);
    margin: 0;
}

/* Metrics Grid */
.billing-metrics {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.billing-metric {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    background: var(--el-bg-soft);
    transition: background 0.2s ease;
}

.billing-metric:hover {
    background: rgba(232, 238, 246, 0.8);
}

.billing-metric--accent {
    background: rgba(25, 120, 229, 0.06);
    border: 1px solid rgba(25, 120, 229, 0.15);
}

.metric-icon-wrap {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 4px rgba(46, 58, 89, 0.08);
    flex-shrink: 0;
}

.metric-icon {
    font-size: 0.875rem;
    color: var(--el-custom);
}

.metric-content {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    flex: 1;
}

.metric-label {
    font-size: 0.78rem;
    color: var(--el-gray);
    font-weight: 500;
}

.metric-value {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--el-primary);
}

.metric-value--accent {
    color: var(--el-custom);
    font-size: 1.25rem;
}

/* Footer note */
.billing-footer {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.775rem;
    color: var(--el-warm-gray);
    padding-top: 0.25rem;
    border-top: 1px solid rgba(169, 177, 186, 0.15);
}

.billing-footer .pi {
    font-size: 0.85rem;
    margin-top: 0.1rem;
    flex-shrink: 0;
}
</style>
