<script setup>
import { onMounted } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';
import ExecutionActions from './execution-actions.component.vue';
import PhotoUpload from './photo-upload.component.vue';
import ComponentRegistration from './component-registration.component.vue';
import ReportForm from './report-form.component.vue';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();

onMounted(async () => {
    await store.fetchExecution(props.executionId);
});
</script>

<template>
  <div v-if="store.currentExecution" class="execution-detail">
    <h2 class="execution-detail__title">Execution Detail</h2>
    <div class="execution-detail__grid">
      <div class="execution-detail__info">
        <div class="execution-detail__row"><strong>Status:</strong> <pv-tag :value="store.currentExecution.status" /></div>
        <div class="execution-detail__row"><strong>Property:</strong> {{ store.currentExecution.propertyId }}</div>
        <div class="execution-detail__row"><strong>Scheduled:</strong> {{ store.currentExecution.scheduledDate }}</div>
        <div class="execution-detail__row"><strong>Started:</strong> {{ store.currentExecution.startedAt || 'Not started' }}</div>
      </div>
      <div class="execution-detail__iot" v-if="store.currentExecution.hasIoTDevice">
        <i class="pi pi-microchip"></i>
        <span>IoT Device: {{ store.currentExecution.iotRelayState ? 'Relay ON' : 'Relay OFF' }}</span>
      </div>
    </div>
    <pv-timeline :value="['Created', 'Assigned', 'In Progress', 'Completed']" class="execution-detail__timeline" />
    <PhotoUpload :execution-id="executionId" />
    <ComponentRegistration :execution-id="executionId" />
    <ReportForm :execution-id="executionId" />
    <ExecutionActions :execution-id="executionId" />
  </div>
</template>

<style scoped>
.execution-detail__title { margin: 0 0 1.5rem; color: var(--el-primary); }
.execution-detail__grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
.execution-detail__info { display: flex; flex-direction: column; gap: 0.75rem; }
.execution-detail__row { font-size: 0.9rem; color: var(--el-primary); }
.execution-detail__row strong { color: var(--el-warm-gray); margin-right: 0.5rem; }
.execution-detail__iot { background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 12px; padding: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.execution-detail__timeline { margin-bottom: 2rem; }
</style>
