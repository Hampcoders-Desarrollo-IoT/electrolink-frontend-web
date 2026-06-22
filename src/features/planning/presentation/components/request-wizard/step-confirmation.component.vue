<script setup>
import { ref } from 'vue';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const props = defineProps({
    requestId: { type: String, default: '' },
    data: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['complete', 'back']);

const store = useServiceRequestStore();
const isConfirming = ref(false);

async function confirm() {
    isConfirming.value = true;
    try {
        if (props.requestId) {
            await store.confirmRequest(props.requestId);
        }
        emit('complete', props.data);
    } finally {
        isConfirming.value = false;
    }
}
</script>

<template>
  <div class="step-confirmation">
    <h3 class="step-confirmation__title">Confirm Your Request</h3>
    <p class="step-confirmation__subtitle">Review your service request details before submitting</p>
    <div class="step-confirmation__summary">
      <div class="step-confirmation__row">
        <span class="step-confirmation__label">Property</span>
        <span class="step-confirmation__value">{{ data.propertyId || '—' }}</span>
      </div>
      <div class="step-confirmation__row">
        <span class="step-confirmation__label">Category</span>
        <span class="step-confirmation__value">{{ data.category || '—' }}</span>
      </div>
      <div class="step-confirmation__row">
        <span class="step-confirmation__label">Description</span>
        <span class="step-confirmation__value">{{ data.description || '—' }}</span>
      </div>
      <div class="step-confirmation__row">
        <span class="step-confirmation__label">Preferred Date</span>
        <span class="step-confirmation__value">{{ data.preferredDate || 'Not specified' }}</span>
      </div>
    </div>
    <div class="step-confirmation__actions">
      <el-button label="Back" icon="pi pi-chevron-left" variant="text" @click="emit('back')" />
      <el-button
        :label="isConfirming ? 'Confirming...' : 'Confirm & Submit'"
        icon="pi pi-check"
        :disabled="isConfirming"
        @click="confirm"
      />
    </div>
  </div>
</template>

<style scoped>
.step-confirmation__title { margin: 0 0 0.25rem; color: var(--el-primary); }
.step-confirmation__subtitle { margin: 0 0 1.5rem; color: var(--el-warm-gray); font-size: 0.9rem; }
.step-confirmation__summary { max-width: 600px; border: 1px solid rgba(169, 177, 186, 0.2); border-radius: 12px; overflow: hidden; }
.step-confirmation__row { display: flex; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(169, 177, 186, 0.1); }
.step-confirmation__row:last-child { border-bottom: none; }
.step-confirmation__label { width: 140px; font-weight: 600; font-size: 0.85rem; color: var(--el-warm-gray); }
.step-confirmation__value { flex: 1; font-size: 0.9rem; color: var(--el-primary); }
.step-confirmation__actions { margin-top: 2rem; display: flex; gap: 1rem; justify-content: space-between; }
</style>
