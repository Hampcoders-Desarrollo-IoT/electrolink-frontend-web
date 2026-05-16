<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  options: { type: Array, default: () => [] }
});

const emit = defineEmits(['submit']);

const selectedComponent = ref(null);
const adjustmentType = ref('INCREASE');
const quantity = ref(0);
const reason = ref(null);
const notes = ref('');

const reasonOptions = [
    { label: 'Damaged in transit', value: 'Damaged in transit' },
    { label: 'Inventory correction', value: 'Inventory correction' },
    { label: 'Return from site', value: 'Return from site' },
    { label: 'Other', value: 'Other' }
];

const isValid = computed(() => {
    return selectedComponent.value && quantity.value > 0 && reason.value;
});

function handleSubmit() {
    if (!isValid.value) return;
    
    emit('submit', {
        componentId: selectedComponent.value,
        type: adjustmentType.value,
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
</script>

<template>
  <form class="ti-tab-body" @submit.prevent="handleSubmit">
    <!-- Component Select -->
    <div class="ti-field">
      <el-select
        v-model="selectedComponent"
        :options="options"
        optionLabel="label"
        optionValue="value"
        label="Component"
        placeholder="Select an owned component..."
      />
      <small v-if="options.length === 0" class="ti-helper ti-helper--error">
          You don't have any components in your inventory yet. Go to "Add New Component".
      </small>
    </div>

    <!-- Adjustment Type -->
    <div class="ti-field">
      <label class="ti-field__label">Adjustment Type</label>
      <div class="ti-type-toggle">
        <button 
          type="button" 
          class="ti-toggle-btn"
          :class="{ 'ti-toggle-btn--increase-active': adjustmentType === 'INCREASE' }"
          @click="adjustmentType = 'INCREASE'"
        >
          <i class="pi pi-arrow-up"></i> Increase
        </button>
        <button 
          type="button" 
          class="ti-toggle-btn"
          :class="{ 'ti-toggle-btn--decrease-active': adjustmentType === 'DECREASE' }"
          @click="adjustmentType = 'DECREASE'"
        >
          <i class="pi pi-arrow-down"></i> Decrease
        </button>
      </div>
    </div>

    <!-- Quantity -->
    <div class="ti-field">
      <label class="ti-field__label">Quantity</label>
      <div class="ti-quantity-wrapper">
        <pv-input-number 
          v-model="quantity" 
          :min="0" 
          class="ti-quantity-input" 
        />
        <div class="ti-quantity-suffix">
          <span>UNITS</span>
        </div>
      </div>
    </div>

    <!-- Reason -->
    <div class="ti-field">
      <el-select
          v-model="reason"
          :options="reasonOptions"
          optionLabel="label"
          optionValue="value"
          label="Reason for Change"
          placeholder="Select reason..."
      />
    </div>

    <!-- Additional Notes -->
    <div class="ti-field">
      <el-textarea
          v-model="notes"
          placeholder="Additional notes..."
          :rows="3"
      />
    </div>

    <!-- Submit Button -->
    <button 
      type="submit" 
      class="ti-submit-btn"
      :disabled="!isValid || options.length === 0"
    >
      Submit Adjustment
    </button>
  </form>
</template>

<style scoped>
.ti-tab-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ti-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ti-field__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
}

.ti-helper {
    font-size: 0.75rem;
    color: var(--el-warm-gray);
}

.ti-helper--error {
    color: #dc2626;
}

/* Toggle Buttons */
.ti-type-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
}

.ti-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--el-warm-gray);
  cursor: pointer;
  transition: all 0.2s;
}

.ti-toggle-btn:hover:not(.ti-toggle-btn--increase-active):not(.ti-toggle-btn--decrease-active) {
  background-color: #e5e7eb;
}

.ti-toggle-btn--increase-active {
  background-color: #dbeafe;
  color: #1d4ed8;
  border-color: #bfdbfe;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.ti-toggle-btn--decrease-active {
  background-color: #fee2e2;
  color: #b91c1c;
  border-color: #fecaca;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* Quantity Input */
.ti-quantity-wrapper {
  position: relative;
  width: 100%;
}

:deep(.p-inputnumber) {
    width: 100%;
}

:deep(.ti-quantity-input .p-inputtext) {
  width: 100%;
  padding-right: 4rem; /* space for suffix */
}

.ti-quantity-suffix {
  position: absolute;
  inset-y: 0;
  right: 0;
  padding-right: 1rem;
  display: flex;
  align-items: center;
  pointer-events: none;
}

.ti-quantity-suffix span {
  font-size: 0.875rem;
  color: var(--el-warm-gray);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Submit Button */
.ti-submit-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background-color: var(--el-primary);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 0.5rem;
}

.ti-submit-btn:hover:not(:disabled) {
  background-color: #1e2536;
}

.ti-submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
