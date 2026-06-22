<script setup>
import { ref } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();
const isProcessing = ref(false);

async function start() {
    isProcessing.value = true;
    try {
        await store.startExecution(props.executionId);
    } finally {
        isProcessing.value = false;
    }
}

async function complete() {
    isProcessing.value = true;
    try {
        await store.completeExecution(props.executionId);
    } finally {
        isProcessing.value = false;
    }
}

async function cancel() {
    isProcessing.value = true;
    try {
        await store.cancelExecution(props.executionId);
    } finally {
        isProcessing.value = false;
    }
}
</script>

<template>
  <div class="execution-actions">
    <el-button
      v-if="store.currentExecution?.status === 'assigned'"
      label="Start Service"
      icon="pi pi-play"
      :disabled="isProcessing"
      @click="start"
    />
    <el-button
      v-if="store.currentExecution?.status === 'in_progress'"
      label="Complete Service"
      icon="pi pi-check"
      :disabled="isProcessing"
      @click="complete"
    />
    <el-button
      v-if="store.currentExecution?.status === 'assigned' || store.currentExecution?.status === 'in_progress'"
      label="Cancel"
      icon="pi pi-times"
      severity="danger"
      variant="text"
      :disabled="isProcessing"
      @click="cancel"
    />
  </div>
</template>

<style scoped>
.execution-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
</style>
