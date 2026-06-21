<script setup>
import { computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

/**
 * Plan catalog definitions.
 * Polimorphic: different plans shown depending on businessRole.
 */
const availablePlans = computed(() => {
    const role    = store.businessRole;
    const current = store.subscription?.planTier ?? '';

    if (role === 'HOMEOWNER') {
        return [
            {
                id:          'homeowner-basic',
                planId:      'plan_homeowner_basic',
                name:        'Plan Básico',
                price:       null,
                priceLabel:  'Free',
                description: 'Essential tools for small property owners.',
                tier:        'BASIC',
                recommended: false,
                isCurrent:   current === 'BASIC',
                features: [
                    { text: '2 Service Requests / month',   highlight: false },
                    { text: 'Standard Support (48h response)', highlight: false },
                    { text: 'Basic Property Listing',       highlight: false },
                ],
                ctaLabel:    'Current Plan',
                ctaVariant:  'outlined',
            },
            {
                id:          'homeowner-premium',
                planId:      'plan_homeowner_premium',
                name:        'Plan Premium',
                price:       29.90,
                priceLabel:  'S/ 29.90',
                description: 'Comprehensive suite for scale and priority resolution.',
                tier:        'PREMIUM',
                recommended: true,
                isCurrent:   current === 'PREMIUM',
                features: [
                    { text: 'Unlimited Service Requests',    highlight: true  },
                    { text: 'Priority Technician Assignment', highlight: false },
                    { text: 'Advanced Analytics & Reporting', highlight: false },
                    { text: '24/7 Premium Support',          highlight: false },
                ],
                ctaLabel:   'Upgrade to Premium',
                ctaVariant: 'filled',
            },
        ];
    }

    if (role === 'COMPANY') {
        return [
            {
                id:          'company-enterprise-basic',
                planId:      'plan_company_enterprise_basic',
                name:        'Enterprise Basic',
                price:       149.00,
                priceLabel:  'S/ 149.00',
                description: 'Up to 50 IoT devices with standard monitoring.',
                tier:        'ENTERPRISE_BASIC',
                recommended: false,
                isCurrent:   current === 'ENTERPRISE_BASIC',
                features: [
                    { text: 'Up to 50 IoT Devices',          highlight: false },
                    { text: 'Basic Dashboard & Alerts',       highlight: false },
                    { text: 'Standard API Access',            highlight: false },
                    { text: 'Email Support',                  highlight: false },
                ],
                ctaLabel:   current === 'ENTERPRISE_BASIC' ? 'Current Plan' : 'Get Started',
                ctaVariant: current === 'ENTERPRISE_BASIC' ? 'outlined' : 'filled',
            },
            {
                id:          'company-enterprise-pro',
                planId:      'plan_company_enterprise_pro',
                name:        'Enterprise Pro',
                price:       399.00,
                priceLabel:  'S/ 399.00',
                description: 'Unlimited devices, advanced analytics, dedicated support.',
                tier:        'ENTERPRISE_PRO',
                recommended: true,
                isCurrent:   current === 'ENTERPRISE_PRO',
                features: [
                    { text: 'Unlimited IoT Devices',          highlight: true  },
                    { text: 'Real-time Analytics',            highlight: false },
                    { text: 'Advanced API & Webhooks',        highlight: false },
                    { text: 'Dedicated Account Manager',      highlight: false },
                ],
                ctaLabel:   current === 'ENTERPRISE_PRO' ? 'Current Plan' : 'Upgrade to Pro',
                ctaVariant: current === 'ENTERPRISE_PRO' ? 'outlined' : 'filled',
            },
        ];
    }

    if (role === 'TECHNICIAN') {
        return [
            {
                id:          'tech-standard',
                planId:      'plan_technician_standard',
                name:        'Technician Standard',
                price:       19.90,
                priceLabel:  'S/ 19.90',
                description: 'Activate your service catalog and get discovered by homeowners.',
                tier:        'TECHNICIAN_STANDARD',
                recommended: false,
                isCurrent:   current === 'TECHNICIAN_STANDARD',
                features: [
                    { text: 'Service Catalog Activation',  highlight: false },
                    { text: 'Appear in Client Searches',   highlight: false },
                    { text: 'In-App Chat with Clients',    highlight: false },
                    { text: 'Monthly Performance Reports', highlight: false },
                ],
                ctaLabel:   current === 'TECHNICIAN_STANDARD' ? 'Current Plan' : 'Activate Catalog',
                ctaVariant: current === 'TECHNICIAN_STANDARD' ? 'outlined' : 'filled',
            },
            {
                id:          'tech-pro',
                planId:      'plan_technician_pro',
                name:        'Technician Pro',
                price:       39.90,
                priceLabel:  'S/ 39.90',
                description: 'Priority placement and advanced tools for high-volume technicians.',
                tier:        'TECHNICIAN_PRO',
                recommended: true,
                isCurrent:   current === 'TECHNICIAN_PRO',
                features: [
                    { text: 'Priority Search Placement',  highlight: true  },
                    { text: 'Verified Pro Badge',         highlight: false },
                    { text: 'Earnings Analytics',         highlight: false },
                    { text: 'Priority Support',           highlight: false },
                ],
                ctaLabel:   current === 'TECHNICIAN_PRO' ? 'Current Plan' : 'Upgrade to Pro',
                ctaVariant: current === 'TECHNICIAN_PRO' ? 'outlined' : 'filled',
            },
        ];
    }

    return [];
});

function handlePlanAction(plan) {
    if (plan.isCurrent) return;
    const isCompany = store.isCompany;
    if (isCompany) {
        store.startEnterpriseCheckout(plan.planId);
    } else {
        store.startCheckout(plan.planId);
    }
}
</script>

<template>
    <section class="plan-grid-section">
        <div class="plan-grid-header">
            <h2 class="plan-grid-title">Available Plans</h2>
            <p class="plan-grid-subtitle">Select the right tier for your facility management needs.</p>
        </div>

        <div class="plan-grid">
            <div
                v-for="plan in availablePlans"
                :key="plan.id"
                :class="['plan-card', { 'plan-card--recommended': plan.recommended, 'plan-card--current': plan.isCurrent }]"
            >
                <!-- Recommended Badge -->
                <div v-if="plan.recommended" class="recommended-badge">
                    <i class="pi pi-star-fill"></i> Recommended
                </div>

                <div class="plan-card-body">
                    <div class="plan-card-top">
                        <h3 class="plan-card-name">
                            {{ plan.name }}
                            <i v-if="plan.recommended" class="pi pi-star-fill plan-star-icon"></i>
                        </h3>

                        <div class="plan-card-pricing">
                            <template v-if="plan.price">
                                <span class="price-currency">S/</span>
                                <span class="price-amount">{{ plan.price.toFixed(2) }}</span>
                                <span class="price-period">/month</span>
                            </template>
                            <template v-else>
                                <span class="price-free">Free</span>
                            </template>
                        </div>

                        <p class="plan-card-description">{{ plan.description }}</p>
                    </div>

                    <!-- Features List -->
                    <ul class="plan-features">
                        <li
                            v-for="feature in plan.features"
                            :key="feature.text"
                            class="plan-feature-item"
                        >
                            <i class="pi pi-verified feature-check"></i>
                            <span :class="{ 'feature-highlight': feature.highlight }">{{ feature.text }}</span>
                        </li>
                    </ul>
                </div>

                <!-- CTA Button -->
                <div class="plan-card-footer">
                    <pv-button
                        :label="plan.isCurrent ? 'Current Plan' : plan.ctaLabel"
                        :disabled="plan.isCurrent"
                        :loading="store.isCheckoutLoading"
                        :class="['plan-cta-btn', { 'plan-cta-btn--filled': !plan.isCurrent && plan.ctaVariant === 'filled' }]"
                        :outlined="plan.isCurrent || plan.ctaVariant === 'outlined'"
                        @click="handlePlanAction(plan)"
                        fluid
                    />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.plan-grid-section {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.plan-grid-header {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.plan-grid-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--el-primary);
    margin: 0;
}

.plan-grid-subtitle {
    font-size: 0.875rem;
    color: var(--el-gray);
    margin: 0;
}

/* Grid */
.plan-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
    align-items: start;
}

/* Plan Card */
.plan-card {
    position: relative;
    background: white;
    border-radius: 14px;
    border: 1.5px solid rgba(169, 177, 186, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.05);
    transition: all 0.25s ease;
}

.plan-card:hover {
    box-shadow: 0 8px 24px rgba(46, 58, 89, 0.12);
    transform: translateY(-2px);
}

.plan-card--recommended {
    border-color: #c9a227;
    box-shadow: 0 4px 20px rgba(201, 162, 39, 0.15);
}

.plan-card--recommended:hover {
    box-shadow: 0 8px 28px rgba(201, 162, 39, 0.22);
}

.plan-card--current {
    border-color: rgba(16, 185, 129, 0.35);
}

/* Recommended Badge */
.recommended-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, #c9a227, #e8c547);
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.35rem 0.875rem;
    border-bottom-left-radius: 10px;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    letter-spacing: 0.02em;
}

.recommended-badge .pi {
    font-size: 0.6rem;
}

/* Card Body */
.plan-card-body {
    padding: 1.75rem;
    padding-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    flex: 1;
}

.plan-card-top {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.plan-card-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--el-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.plan-star-icon {
    font-size: 0.85rem;
    color: #c9a227;
}

/* Pricing */
.plan-card-pricing {
    display: flex;
    align-items: baseline;
    gap: 0.125rem;
    margin: 0.25rem 0;
}

.price-currency {
    font-size: 1rem;
    font-weight: 600;
    color: var(--el-gray);
}

.price-amount {
    font-size: 2.75rem;
    font-weight: 800;
    color: var(--el-primary);
    line-height: 1;
}

.price-period {
    font-size: 0.875rem;
    color: var(--el-gray);
    margin-left: 0.25rem;
}

.price-free {
    font-size: 2.25rem;
    font-weight: 800;
    color: var(--el-primary);
}

.plan-card-description {
    font-size: 0.85rem;
    color: var(--el-gray);
    margin: 0;
    line-height: 1.4;
}

/* Features */
.plan-features {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.plan-feature-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 0.875rem;
    color: var(--el-primary);
}

.feature-check {
    color: var(--el-custom);
    font-size: 0.9rem;
    flex-shrink: 0;
}

.feature-highlight {
    font-weight: 700;
}

/* Card Footer */
.plan-card-footer {
    padding: 0 1.75rem 1.75rem;
}

.plan-cta-btn {
    width: 100%;
    font-weight: 600;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.plan-cta-btn--filled {
    background: var(--el-primary) !important;
    border-color: var(--el-primary) !important;
    color: white !important;
}

.plan-cta-btn--filled:hover:not(:disabled) {
    background: #1e2d45 !important;
    border-color: #1e2d45 !important;
}
</style>
