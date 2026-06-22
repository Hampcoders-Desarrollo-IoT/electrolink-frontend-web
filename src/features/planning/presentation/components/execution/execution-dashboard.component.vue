<script setup>
import { onMounted } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const store = useServiceExecutionStore();

onMounted(async () => {
    await store.fetchAssigned('me');
});

function getSeverity(status) {
    const map = { assigned: 'info', in_progress: 'warn', completed: 'success', cancelled: 'danger' };
    return map[status] || 'info';
}
</script>

<template>
  <div class="execution-dashboard">
    <h2 class="execution-dashboard__title">Service Executions</h2>
    <div class="execution-dashboard__board">
      <div class="execution-dashboard__column">
        <h3 class="execution-dashboard__column-title">
          Assigned ({{ store.pendingServices.length }})
        </h3>
        <div v-for="exec in store.pendingServices" :key="exec.executionId" class="execution-dashboard__card">
          <strong>{{ exec.requestId }}</strong>
          <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
        </div>
        <div v-if="!store.pendingServices.length" class="execution-dashboard__empty">No pending services</div>
      </div>
      <div class="execution-dashboard__column">
        <h3 class="execution-dashboard__column-title">
          In Progress ({{ store.inProgressServices.length }})
        </h3>
        <div v-for="exec in store.inProgressServices" :key="exec.executionId" class="execution-dashboard__card">
          <strong>{{ exec.requestId }}</strong>
          <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
        </div>
        <div v-if="!store.inProgressServices.length" class="execution-dashboard__empty">No services in progress</div>
      </div>
      <div class="execution-dashboard__column">
        <h3 class="execution-dashboard__column-title">
          Completed ({{ store.completedServices.length }})
        </h3>
        <div v-for="exec in store.completedServices" :key="exec.executionId" class="execution-dashboard__card">
          <strong>{{ exec.requestId }}</strong>
          <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
        </div>
        <div v-if="!store.completedServices.length" class="execution-dashboard__empty">No completed services</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.execution-dashboard__title { margin: 0 0 1.5rem; color: var(--el-primary); }
.execution-dashboard__board { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
.execution-dashboard__column { background: rgba(169, 177, 186, 0.05); border-radius: 12px; padding: 1rem; min-height: 300px; }
.execution-dashboard__column-title { font-size: 0.9rem; color: var(--el-warm-gray); margin: 0 0 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
.execution-dashboard__card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;
  display: flex; justify-content: space-between; align-items: center;
}
.execution-dashboard__empty { text-align: center; padding: 2rem; color: var(--el-warm-gray); font-size: 0.85rem; }
</style>
