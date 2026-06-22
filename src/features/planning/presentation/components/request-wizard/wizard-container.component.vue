<script setup>
import { ref, watch, onMounted } from 'vue';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const props = defineProps({
    requestId: { type: String, default: '' }
});

const emit = defineEmits(['complete', 'error']);

const store = useServiceRequestStore();

const steps = ref([
    { label: 'Property', value: 0 },
    { label: 'Category', value: 1 },
    { label: 'Details', value: 2 },
    { label: 'Confirm', value: 3 }
]);
const activeStep = ref(0);
const stepData = ref({});

const stepComponents = [
    'step-property-selection',
    'step-category-selection',
    'step-details',
    'step-confirmation'
];

function onStepComplete(data) {
    stepData.value = { ...stepData.value, ...data };
    if (activeStep.value < steps.value.length - 1) {
        activeStep.value++;
    } else {
        emit('complete', stepData.value);
    }
}

function onStepBack() {
    if (activeStep.value > 0) activeStep.value--;
}
</script>

<template>
  <div class="wizard-container">
    <pv-steps v-model="activeStep" :model="steps" :readonly="false" />
    <div class="wizard-container__content">
      <step-property-selection
        v-if="activeStep === 0"
        @complete="onStepComplete"
        @back="onStepBack"
      />
      <step-category-selection
        v-if="activeStep === 1"
        :request-id="requestId"
        @complete="onStepComplete"
        @back="onStepBack"
      />
      <step-details
        v-if="activeStep === 2"
        @complete="onStepComplete"
        @back="onStepBack"
      />
      <step-confirmation
        v-if="activeStep === 3"
        :request-id="requestId"
        :data="stepData"
        @complete="onStepComplete"
        @back="onStepBack"
      />
    </div>
  </div>
</template>

<style scoped>
.wizard-container__content {
  margin-top: 2rem;
}
</style>
