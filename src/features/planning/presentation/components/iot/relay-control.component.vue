<script setup>
import { ref } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();
const showConfirm = ref(false);
const isToggling = ref(false);

async function toggleRelay() {
    isToggling.value = true;
    try {
        await store.toggleRelay(props.executionId);
        showConfirm.value = false;
    } finally {
        isToggling.value = false;
    }
}
</script>

<template>
  <div class="relay-control">
    <div class="relay-control__info">
      <i class="pi pi-microchip"></i>
      <span>Relay Control</span>
    </div>
    <el-switcher
      :model-value="store.currentExecution?.iotRelayState"
      @update:model-value="showConfirm = true"
    />
    <el-confirm-dialog
      v-model:visible="showConfirm"
      header="Toggle Relay"
      message="Are you sure you want to toggle the IoT relay?"
      :loading="isToggling"
      @confirm="toggleRelay"
    />
  </div>
</template>

<style scoped>
.relay-control { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem; background: white; border: 1px solid rgba(169, 177, 186, 0.2); border-radius: 12px; }
.relay-control__info { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--el-primary); }
.relay-control__info i { font-size: 1.2rem; }
</style>
