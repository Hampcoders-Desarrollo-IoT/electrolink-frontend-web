<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const router = useRouter();
const store = useServiceRequestStore();

onMounted(async () => {
    await store.fetchEligibility();
    await store.fetchRequests('me');
});

function newRequest() {
    router.push({ name: 'planning-request-wizard' });
}

function viewDetail(requestId) {
    router.push({ name: 'planning-request-detail', params: { id: requestId } });
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateStr;
    }
}

function getStatusSeverity(status) {
    const map = { pending: 'info', in_progress: 'warn', completed: 'success', cancelled: 'danger' };
    return map[status] || 'info';
}
</script>

<template>
  <div class="request-list">
    <div class="request-list__header">
      <div>
        <h2 class="request-list__title">My Service Requests</h2>
        <p v-if="store.isEligible !== null" class="request-list__eligibility">
          <pv-tag :value="store.isEligible ? 'Eligible' : 'Limit Reached'" :severity="store.isEligible ? 'success' : 'danger'" />
          <span v-if="store.remainingRequests > 0"> {{ store.remainingRequests }} requests remaining this month</span>
        </p>
      </div>
      <el-button v-if="store.isEligible" label="New Request" icon="pi pi-plus" @click="newRequest" />
    </div>

    <div v-if="store.isLoading" class="request-list__loading">
      <pv-skeleton width="100%" height="80px" borderRadius="12px" />
      <pv-skeleton width="100%" height="80px" borderRadius="12px" />
    </div>
    <div v-else-if="!store.requests.length" class="request-list__empty">
      <i class="pi pi-inbox request-list__empty-icon"></i>
      <p class="request-list__empty-title">No service requests yet</p>
      <p class="request-list__empty-desc">Create your first request to get started</p>
      <el-button v-if="store.isEligible" label="Create Your First Request" icon="pi pi-plus" @click="newRequest" class="request-list__empty-btn" />
    </div>
    <div v-else class="request-list__grid">
      <div
        v-for="req in store.requests"
        :key="req.requestId"
        class="request-list__card"
        @click="viewDetail(req.requestId)"
      >
        <div class="request-list__card-header">
          <span class="request-list__card-id">{{ req.requestId }}</span>
          <pv-tag :value="req.status" :severity="getStatusSeverity(req.status)" />
        </div>
        <div class="request-list__card-meta">
          <span v-if="req.requestedCategory" class="request-list__card-meta-item"><i class="pi pi-tag"></i> {{ req.requestedCategory }}</span>
          <span v-if="req.createdAt" class="request-list__card-meta-item"><i class="pi pi-calendar"></i> {{ formatDate(req.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.request-list__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.request-list__title { margin: 0; color: var(--el-primary); }
.request-list__eligibility { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.85rem; color: var(--el-warm-gray); }

.request-list__loading { display: flex; flex-direction: column; gap: 0.75rem; }

.request-list__empty { text-align: center; padding: 4rem 2rem; }
.request-list__empty-icon { font-size: 3rem; color: var(--el-warm-gray); margin-bottom: 1rem; display: block; }
.request-list__empty-title { font-size: 1.1rem; font-weight: 600; color: var(--el-primary); margin: 0 0 0.5rem; }
.request-list__empty-desc { font-size: 0.9rem; color: var(--el-warm-gray); margin: 0 0 1.5rem; }

.request-list__grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
@media (min-width: 768px) { .request-list__grid { grid-template-columns: repeat(2, 1fr); } }
.request-list__card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-left: 4px solid var(--el-celeste);
  border-radius: 12px; padding: 1rem; cursor: pointer;
  transition: box-shadow 0.2s;
}
.request-list__card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); }
.request-list__card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
.request-list__card-id { font-weight: 600; font-size: 0.85rem; color: var(--el-primary); }
.request-list__card-meta { display: flex; gap: 1rem; flex-wrap: wrap; }
.request-list__card-meta-item { font-size: 0.8rem; color: var(--el-warm-gray); }
.request-list__card-meta-item i { margin-right: 0.25rem; }
</style>
