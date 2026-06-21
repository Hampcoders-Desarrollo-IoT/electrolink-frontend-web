<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  options: { type: Array, default: () => [] },
  componentTypeOptions: { type: Array, default: () => [] }
});

const emit = defineEmits(['submit']);

const selectedComponent = ref(null);
const selectedComponentType = ref(null);
const quantity = ref(0);
const alertThreshold = ref(5);

const isValid = computed(() => {
    return selectedComponent.value && selectedComponentType.value && quantity.value > 0 && alertThreshold.value > 0;
});

function handleSubmit() {
    if (!isValid.value) return;
    
    emit('submit', {
        componentId: selectedComponent.value,
        componentTypeId: selectedComponentType.value,
        type: 'INCREASE', // Always INCREASE for new additions
        quantity: quantity.value,
        alertThreshold: alertThreshold.value
    });
    
    resetForm();
}

function resetForm() {
    selectedComponent.value = null;
    selectedComponentType.value = null;
    quantity.value = 0;
    alertThreshold.value = 5;
}
</script>

<template>
  <form class="ti-tab-body" @submit.prevent="handleSubmit">
    <!-- General Info Banner -->
    <div class="ti-info-box">
        <i class="pi pi-info-circle"></i>
        Select a component from the global catalog to add to your personal inventory.
    </div>

    <!-- Component Select -->
    <div class="ti-field">
      <el-select
        v-model="selectedComponent"
        :options="options"
        optionLabel="label"
        optionValue="value"
        label="Component"
        placeholder="Select a component from catalog..."
      />
      <small v-if="options.length === 0" class="ti-helper">
          You already have all available components in your inventory.
      </small>
    </div>

    <!-- Component Type Select -->
    <div class="ti-field">
      <el-select
        v-model="selectedComponentType"
        :options="componentTypeOptions"
        optionLabel="label"
        optionValue="value"
        label="Component Type"
        placeholder="Select a component type..."
      />
    </div>

    <!-- Quantity -->
    <div class="ti-field">
      <label class="ti-field__label">Initial Quantity</label>
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

    <!-- Alert Threshold -->
    <div class="ti-field ti-field--highlight">
      <label class="ti-field__label">
        Low Stock Alert Threshold
        <i class="pi pi-bell" style="font-size: 0.8em; margin-left: 4px; color: #d97706;"></i>
      </label>
      <div class="ti-quantity-wrapper">
        <pv-input-number 
          v-model="alertThreshold" 
          :min="1" 
          class="ti-quantity-input" 
        />
        <div class="ti-quantity-suffix">
          <span>UNITS</span>
        </div>
      </div>
      <small class="ti-helper ti-helper--dark">You will be notified when stock drops below this level.</small>
    </div>

    <!-- Submit Button -->
    <button 
      type="submit" 
      class="ti-submit-btn"
      :disabled="!isValid || options.length === 0"
    >
      Add to Inventory
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

.ti-info-box {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #eff6ff;
    border-radius: 0.5rem;
    color: #1e3a8a;
    font-size: 0.875rem;
}

.ti-info-box i {
    color: #3b82f6;
    margin-top: 0.125rem;
}

.ti-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ti-field--highlight {
  background-color: #fef3c7;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px dashed #fbbf24;
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

.ti-helper--dark {
    color: #92400e;
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
