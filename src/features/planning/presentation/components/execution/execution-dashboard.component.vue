<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const router = useRouter();
const store = useServiceExecutionStore();

onMounted(async () => {
    await store.fetchAssigned('me');
});

function getSeverity(status) {
    const map = { assigned: 'info', in_progress: 'warn', completed: 'success', cancelled: 'danger' };
    return map[status] || 'info';
}

function openDetail(exec) {
    router.push({ name: 'planning-execution-detail', params: { id: exec.executionId } });
}
</script>

<template>
  <div class="execution-dashboard">
    <h2 class="execution-dashboard__title">Service Executions</h2>

    <div v-if="store.isLoading" class="execution-dashboard__loading">
      <div class="execution-dashboard__kpi">
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
      </div>
      <div class="execution-dashboard__board">
        <div v-for="i in 3" :key="i" class="execution-dashboard__column">
          <pv-skeleton width="140px" height="20px" borderRadius="4px" style="margin-bottom: 1rem;" />
          <pv-skeleton width="100%" height="80px" borderRadius="8px" />
          <pv-skeleton width="100%" height="80px" borderRadius="8px" />
        </div>
      </div>
    </div>
    <template v-else>
      <div class="execution-dashboard__kpi">
        <div class="execution-dashboard__kpi-card">
          <span class="execution-dashboard__kpi-value">{{ store.pendingServices.length }}</span>
          <span class="execution-dashboard__kpi-label">Pending</span>
        </div>
        <div class="execution-dashboard__kpi-card execution-dashboard__kpi-card--progress">
          <span class="execution-dashboard__kpi-value">{{ store.inProgressServices.length }}</span>
          <span class="execution-dashboard__kpi-label">In Progress</span>
        </div>
        <div class="execution-dashboard__kpi-card execution-dashboard__kpi-card--completed">
          <span class="execution-dashboard__kpi-value">{{ store.completedServices.length }}</span>
          <span class="execution-dashboard__kpi-label">Completed</span>
        </div>
      </div>

      <div class="execution-dashboard__board">
        <div class="execution-dashboard__column">
          <h3 class="execution-dashboard__column-title">
            Assigned ({{ store.pendingServices.length }})
          </h3>
          <div v-for="exec in store.pendingServices" :key="exec.executionId" class="execution-dashboard__card" @click="openDetail(exec)">
            <div class="execution-dashboard__card-info">
              <strong>{{ exec.requestId }}</strong>
              <span v-if="exec.scheduledDate" class="execution-dashboard__card-date">{{ exec.scheduledDate }}</span>
            </div>
            <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
          </div>
          <div v-if="!store.pendingServices.length" class="execution-dashboard__empty">No pending services</div>
        </div>
        <div class="execution-dashboard__column">
          <h3 class="execution-dashboard__column-title">
            In Progress ({{ store.inProgressServices.length }})
          </h3>
          <div v-for="exec in store.inProgressServices" :key="exec.executionId" class="execution-dashboard__card" @click="openDetail(exec)">
            <div class="execution-dashboard__card-info">
              <strong>{{ exec.requestId }}</strong>
              <span v-if="exec.scheduledDate" class="execution-dashboard__card-date">{{ exec.scheduledDate }}</span>
            </div>
            <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
          </div>
          <div v-if="!store.inProgressServices.length" class="execution-dashboard__empty">No services in progress</div>
        </div>
        <div class="execution-dashboard__column">
          <h3 class="execution-dashboard__column-title">
            Completed ({{ store.completedServices.length }})
          </h3>
          <div v-for="exec in store.completedServices" :key="exec.executionId" class="execution-dashboard__card" @click="openDetail(exec)">
            <div class="execution-dashboard__card-info">
              <strong>{{ exec.requestId }}</strong>
              <span v-if="exec.scheduledDate" class="execution-dashboard__card-date">{{ exec.scheduledDate }}</span>
            </div>
            <pv-tag :value="exec.status" :severity="getSeverity(exec.status)" />
          </div>
          <div v-if="!store.completedServices.length" class="execution-dashboard__empty">No completed services</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.execution-dashboard__title { margin: 0 0 1.5rem; color: var(--el-primary); }

.execution-dashboard__loading { display: flex; flex-direction: column; gap: 1.5rem; }

.execution-dashboard__kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.execution-dashboard__kpi-card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px; padding: 1rem; text-align: center;
  border-left: 4px solid var(--el-warm-gray);
}
.execution-dashboard__kpi-card--progress { border-left-color: var(--el-celeste); }
.execution-dashboard__kpi-card--completed { border-left-color: var(--el-success); }
.execution-dashboard__kpi-card:first-child { border-left-color: var(--el-primary); }
.execution-dashboard__kpi-value { display: block; font-size: 1.75rem; font-weight: 700; color: var(--el-primary); }
.execution-dashboard__kpi-label { font-size: 0.8rem; color: var(--el-warm-gray); text-transform: uppercase; letter-spacing: 0.05em; }

.execution-dashboard__board { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .execution-dashboard__board { grid-template-columns: repeat(3, 1fr); } }
.execution-dashboard__column { background: rgba(169, 177, 186, 0.05); border-radius: 12px; padding: 1rem; min-height: 200px; }
.execution-dashboard__column-title { font-size: 0.9rem; color: var(--el-warm-gray); margin: 0 0 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
.execution-dashboard__card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 8px; padding: 0.75rem; margin-bottom: 0.5rem;
  display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; transition: box-shadow 0.2s;
}
.execution-dashboard__card:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
.execution-dashboard__card-info { display: flex; flex-direction: column; gap: 0.15rem; }
.execution-dashboard__card-date { font-size: 0.75rem; color: var(--el-warm-gray); }
.execution-dashboard__empty { text-align: center; padding: 2rem; color: var(--el-warm-gray); font-size: 0.85rem; }
</style>
