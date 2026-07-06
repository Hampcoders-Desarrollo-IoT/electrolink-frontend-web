<script setup>
import { ref, onMounted } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const store = useServiceExecutionStore();
const searchFilter = ref('');

onMounted(async () => {
    await store.fetchHistory('me');
});

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

function truncateId(id) {
    if (!id) return '—';
    return id.length > 12 ? id.slice(0, 12) + '...' : id;
}

function getStatusSeverity(status) {
    const map = { assigned: 'info', in_progress: 'warn', completed: 'success', cancelled: 'danger' };
    return map[status] || 'info';
}
</script>

<template>
  <div class="service-history">
    <div class="service-history__header">
      <div>
        <h2 class="service-history__title">Service History</h2>
        <span v-if="store.history.length" class="service-history__count">{{ store.history.length }} service(s)</span>
      </div>
    </div>

    <div v-if="store.isLoading" class="service-history__loading">
      <div class="service-history__search-skeleton">
        <pv-skeleton width="280px" height="36px" borderRadius="8px" />
      </div>
      <pv-skeleton width="100%" height="48px" borderRadius="8px" />
      <pv-skeleton width="100%" height="48px" borderRadius="8px" />
      <pv-skeleton width="100%" height="48px" borderRadius="8px" />
    </div>
    <div v-else-if="!store.history.length" class="service-history__empty">
      <i class="pi pi-history service-history__empty-icon"></i>
      <p class="service-history__empty-title">No service history yet</p>
      <p class="service-history__empty-desc">Completed services will appear here</p>
    </div>
    <template v-else>
      <div class="service-history__search">
        <i class="pi pi-search service-history__search-icon"></i>
        <input v-model="searchFilter" type="text" class="service-history__search-input" placeholder="Search by ID, status..." />
      </div>
      <pv-data-table :value="store.history" class="service-history__table" :globalFilterFields="['executionId', 'status', 'propertyId']" paginator :rows="10">
        <pv-column field="executionId" header="ID">
          <template #body="{ data }">
            <span :title="data.executionId">{{ truncateId(data.executionId) }}</span>
          </template>
        </pv-column>
        <pv-column field="status" header="Status">
          <template #body="{ data }">
            <pv-tag :value="data.status" :severity="getStatusSeverity(data.status)" />
          </template>
        </pv-column>
        <pv-column field="scheduledDate" header="Date">
          <template #body="{ data }">
            {{ formatDate(data.scheduledDate) }}
          </template>
        </pv-column>
        <pv-column field="propertyId" header="Property">
          <template #body="{ data }">
            {{ truncateId(data.propertyId) }}
          </template>
        </pv-column>
      </pv-data-table>
    </template>
  </div>
</template>

<style scoped>
.service-history__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.service-history__title { margin: 0; color: var(--el-primary); }
.service-history__count { font-size: 0.85rem; color: var(--el-warm-gray); }

.service-history__loading { display: flex; flex-direction: column; gap: 0.75rem; }
.service-history__search-skeleton { margin-bottom: 0.5rem; }

.service-history__search { position: relative; margin-bottom: 1rem; }
.service-history__search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--el-warm-gray); font-size: 0.9rem; }
.service-history__search-input {
  width: 100%; max-width: 320px; padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  border: 1px solid rgba(169, 177, 186, 0.3); border-radius: 8px;
  font-size: 0.85rem; color: var(--el-primary); outline: none;
  background: white; box-sizing: border-box;
}
.service-history__search-input:focus { border-color: var(--el-celeste); }

.service-history__empty { text-align: center; padding: 4rem 2rem; }
.service-history__empty-icon { font-size: 3rem; color: var(--el-warm-gray); margin-bottom: 1rem; display: block; }
.service-history__empty-title { font-size: 1.1rem; font-weight: 600; color: var(--el-primary); margin: 0 0 0.5rem; }
.service-history__empty-desc { font-size: 0.9rem; color: var(--el-warm-gray); margin: 0; }
</style>
