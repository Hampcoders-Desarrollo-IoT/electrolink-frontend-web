<script setup>
import { onMounted } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const store = useServiceExecutionStore();

onMounted(async () => {
    await store.fetchHistory('me');
});
</script>

<template>
  <div class="service-history">
    <h2 class="service-history__title">Service History</h2>
    <pv-data-table :value="store.history" class="service-history__table">
      <pv-column field="executionId" header="ID" />
      <pv-column field="status" header="Status">
        <template #body="{ data }">
          <pv-tag :value="data.status" />
        </template>
      </pv-column>
      <pv-column field="scheduledDate" header="Date" />
      <pv-column field="propertyId" header="Property" />
    </pv-data-table>
  </div>
</template>

<style scoped>
.service-history__title { margin: 0 0 1.5rem; color: var(--el-primary); }
</style>
