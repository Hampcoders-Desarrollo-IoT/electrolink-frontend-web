<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

const planIcon = computed(() => {
    const tier = store.subscription?.planTier ?? '';
    if (tier.includes('PREMIUM'))         return 'pi-star-fill';
    if (tier.includes('ENTERPRISE'))      return 'pi-building';
    if (tier.includes('TECHNICIAN'))      return 'pi-wrench';
    return 'pi-shield';
});

const planDescription = computed(() => {
    const tier = store.subscription?.planTier ?? '';
    const role = store.businessRole;
    if (role === 'HOMEOWNER' && tier === 'BASIC')    return 'Free tier for standard property management.';
    if (role === 'HOMEOWNER' && tier === 'PREMIUM')  return 'Comprehensive suite for scale and priority resolution.';
    if (role === 'COMPANY' && tier.includes('ENTERPRISE_BASIC')) return 'Entry-level corporate IoT monitoring plan.';
    if (role === 'COMPANY' && tier.includes('ENTERPRISE_PRO'))   return 'Full-scale enterprise IoT infrastructure plan.';
    if (role === 'TECHNICIAN')                       return 'Activate your service catalog and appear in searches.';
    return 'Your current subscription plan.';
});

const formattedPrice = computed(() => {
    const price = store.subscription?.pricePerMonth ?? 0;
    if (price === 0) return 'Free';
    return `S/ ${Number(price).toFixed(2)}/mo`;
});

const renewalDate = computed(() => {
    const end = store.subscription?.currentPeriodEnd;
    if (!end) return null;
    return new Date(end).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });
});
</script>

<template>
    <div class="current-plan-card">
        <div class="plan-card-header">
            <div class="plan-card-label">
                <i :class="`pi ${planIcon} plan-icon`"></i>
                <span class="plan-label-text">CURRENT PLAN</span>
            </div>
            <pv-tag
                :value="store.statusLabel"
                :severity="store.statusSeverity"
                class="status-badge"
            />
        </div>

        <h2 class="plan-name">{{ store.planName }}</h2>
        <p class="plan-description">{{ planDescription }}</p>

        <div class="plan-price-row">
            <span class="plan-price">{{ formattedPrice }}</span>
            <span v-if="renewalDate" class="plan-renewal">
                Renews {{ renewalDate }}
            </span>
        </div>

        <div v-if="store.subscription?.cancelAtPeriodEnd" class="cancel-notice">
            <i class="pi pi-info-circle"></i>
            <span>Cancels at end of billing period</span>
        </div>
    </div>
</template>

<style scoped>
.current-plan-card {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(169, 177, 186, 0.2);
    padding: 1.75rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.06);
    transition: box-shadow 0.2s ease;
}

.current-plan-card:hover {
    box-shadow: 0 4px 16px rgba(46, 58, 89, 0.10);
}

.plan-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.25rem;
}

.plan-card-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.plan-label-text {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--el-gray);
    text-transform: uppercase;
}

.plan-icon {
    font-size: 0.85rem;
    color: var(--el-custom);
}

.plan-name {
    font-size: 2rem;
    font-weight: 800;
    color: var(--el-primary);
    margin: 0;
    line-height: 1.1;
}

.plan-description {
    font-size: 0.875rem;
    color: var(--el-gray);
    margin: 0;
    line-height: 1.5;
    flex: 1;
}

.plan-price-row {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.plan-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--el-primary);
}

.plan-renewal {
    font-size: 0.8rem;
    color: var(--el-warm-gray);
}

.status-badge {
    font-size: 0.75rem;
    font-weight: 600;
}

.cancel-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8rem;
    color: #f59e0b;
    background: rgba(245, 158, 11, 0.08);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    margin-top: 0.25rem;
}

.cancel-notice .pi {
    font-size: 0.85rem;
}
</style>
