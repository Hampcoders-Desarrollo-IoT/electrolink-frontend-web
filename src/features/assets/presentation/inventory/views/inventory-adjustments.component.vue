<script setup>
import { ref, onMounted } from 'vue';
import { useInventoryStore } from '../../../application/inventory.store.js';
import { useComponentStore } from '../../../application/component.store.js';

const inventoryStore = useInventoryStore();
const componentStore = useComponentStore();

const selectedComponent = ref(null);
const adjustmentType = ref('INCREASE');
const quantity = ref(0);
const reason = ref(null);
const notes = ref('');

const typeOptions = [
    { label: 'Increase', value: 'INCREASE', icon: 'pi pi-arrow-up' },
    { label: 'Decrease', value: 'DECREASE', icon: 'pi pi-arrow-down' }
];

const reasonOptions = [
    { label: 'Restock / Purchase', value: 'Restock / Purchase' },
    { label: 'Damaged in transit', value: 'Damaged in transit' },
    { label: 'Quarterly Restock', value: 'Quarterly Restock' },
    { label: 'Inventory correction', value: 'Inventory correction' },
    { label: 'Return from site', value: 'Return from site' },
    { label: 'Other', value: 'Other' }
];

onMounted(() => {
    inventoryStore.loadInventory();
    componentStore.loadAdjustments();
});

const componentOptions = ref([]);
import { watch } from 'vue';
watch(() => inventoryStore.inventory, (items) => {
    componentOptions.value = items.map(item => ({
        label: `${item.name} (${item.sku})`,
        value: item.id
    }));
}, { immediate: true });

function submitAdjustment() {
    componentStore.createAdjustment({
        componentId: selectedComponent.value,
        adjustmentType: adjustmentType.value,
        quantity: quantity.value,
        reason: reason.value,
        notes: notes.value
    });
    resetForm();
}

function resetForm() {
    selectedComponent.value = null;
    adjustmentType.value = 'INCREASE';
    quantity.value = 0;
    reason.value = null;
    notes.value = '';
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: undefined }) +
        ', ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="adjustments-view">
    <!-- Header -->
    <div class="adjustments-view__header">
      <div>
        <h1 class="adjustments-view__title">Inventory Adjustments</h1>
        <p class="adjustments-view__subtitle">Manual stock reconciliation and audit trail</p>
      </div>
      <div class="adjustments-view__header-actions">
        <el-button variant="ghost" icon="pi pi-list" label="Audit Log" />
        <el-button variant="secondary" icon="pi pi-download" label="Export CSV" />
      </div>
    </div>

    <!-- Main Content: 2-column layout -->
    <div class="adjustments-view__content">
      <!-- Left Column: New Adjustment Form -->
      <pv-card class="adjustments-form">
        <template #title>
          <div class="adjustments-form__title">
            <i class="pi pi-plus-circle"></i> New Adjustment
          </div>
        </template>
        <template #content>
          <div class="adjustments-form__body">
            <el-select
              v-model="selectedComponent"
              :options="componentOptions"
              optionLabel="label"
              optionValue="value"
              label="Component"
              placeholder="Select a component..."
            />

            <div class="adjustments-form__field">
              <label class="adjustments-form__label">Adjustment Type</label>
              <pv-select-button
                v-model="adjustmentType"
                :options="typeOptions"
                optionLabel="label"
                optionValue="value"
                class="adjustments-form__type-selector"
              />
            </div>

            <div class="adjustments-form__field">
              <label class="adjustments-form__label">Quantity</label>
              <pv-input-number v-model="quantity" :min="0" suffix=" UNITS" class="adjustments-form__input" />
            </div>

            <el-select
              v-model="reason"
              :options="reasonOptions"
              optionLabel="label"
              optionValue="value"
              label="Reason for Change"
              placeholder="Select reason..."
            />

            <el-textarea
              v-model="notes"
              label="Additional notes..."
              placeholder="Additional notes..."
              :rows="3"
            />

            <el-button
              variant="primary"
              label="Submit Adjustment"
              icon="pi pi-check"
              @click="submitAdjustment"
              :disabled="!selectedComponent || quantity <= 0 || !reason"
              style="width: 100%"
            />
          </div>
        </template>
      </pv-card>

      <!-- Right Column: Recent History -->
      <div class="adjustments-history">
        <div class="adjustments-history__header">
          <h2 class="adjustments-history__title">Recent History</h2>
          <pv-tag value="Live Updates" severity="success" icon="pi pi-circle-fill" />
        </div>

        <div class="adjustments-history__list">
          <div
            v-for="adjustment in componentStore.adjustments"
            :key="adjustment.id"
            class="adjustment-card"
          >
            <div class="adjustment-card__info">
              <span class="adjustment-card__name">{{ adjustment.componentName }}</span>
              <span class="adjustment-card__sku">{{ adjustment.componentSku }}</span>
            </div>
            <div class="adjustment-card__type">
              <pv-tag
                :value="adjustment.type"
                :severity="adjustment.isIncrease ? 'success' : 'danger'"
                :icon="adjustment.isIncrease ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"
              />
            </div>
            <div class="adjustment-card__quantity" :class="{ 'adjustment-card__quantity--positive': adjustment.isIncrease, 'adjustment-card__quantity--negative': adjustment.isDecrease }">
              {{ adjustment.signedQuantity }}
            </div>
            <div class="adjustment-card__reason">{{ adjustment.reason }}</div>
            <div class="adjustment-card__date">{{ formatDate(adjustment.date) }}</div>
          </div>

          <p v-if="componentStore.adjustments.length === 0 && !componentStore.isLoading" class="adjustments-history__empty">
            No adjustments recorded yet.
          </p>
        </div>

        <!-- Note for Technicians -->
        <pv-message severity="warn" :closable="false" class="adjustments-history__note">
          <template #default>
            <div>
              <strong>Note for Technicians</strong>
              <p style="margin: 0.5rem 0 0; font-size: 0.85rem;">
                Manual adjustments are logged for inventory reconciliation. All changes are logged with your
                profile and timestamp. Significant decreases (>25% stock) require supervisor approval before final
                processing.
              </p>
            </div>
          </template>
        </pv-message>
      </div>
    </div>
  </div>
</template>

<style scoped>
.adjustments-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.adjustments-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.adjustments-view__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.adjustments-view__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
}

.adjustments-view__header-actions {
  display: flex;
  gap: 0.75rem;
}

.adjustments-view__content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 1.5rem;
  align-items: start;
}

.adjustments-form__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: var(--el-primary);
}

.adjustments-form__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.adjustments-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.adjustments-form__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
}

.adjustments-form__input {
  width: 100%;
}

:deep(.adjustments-form__input .p-inputnumber-input) {
  width: 100%;
  border-radius: 8px !important;
  border: 1px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  padding: 0.75rem 1rem !important;
}

.adjustments-history {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.adjustments-history__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.adjustments-history__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.adjustments-history__list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.adjustment-card {
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 0.5fr 1fr 0.8fr;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(169, 177, 186, 0.2);
  transition: box-shadow 0.2s ease;
}

.adjustment-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.adjustment-card__name {
  display: block;
  font-weight: 600;
  color: var(--el-primary);
  font-size: 0.9rem;
}

.adjustment-card__sku {
  display: block;
  font-size: 0.75rem;
  color: var(--el-warm-gray);
}

.adjustment-card__quantity {
  font-weight: 700;
  font-size: 1rem;
}

.adjustment-card__quantity--positive {
  color: var(--el-success);
}

.adjustment-card__quantity--negative {
  color: var(--el-danger);
}

.adjustment-card__reason {
  font-size: 0.85rem;
  color: var(--el-warm-gray);
}

.adjustment-card__date {
  font-size: 0.8rem;
  color: var(--el-warm-gray);
  text-align: right;
}

.adjustments-history__empty {
  text-align: center;
  color: var(--el-warm-gray);
  padding: 2rem;
}

.adjustments-history__note {
  margin: 0;
}

@media (max-width: 768px) {
  .adjustments-view__content {
    grid-template-columns: 1fr;
  }

  .adjustment-card {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}
</style>
