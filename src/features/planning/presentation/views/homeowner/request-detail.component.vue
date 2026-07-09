<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const route = useRoute();
const router = useRouter();
const store = useServiceRequestStore();

onMounted(async () => {
    await store.fetchRequest(route.params.id);
});

function goBack() {
    router.push({ name: 'planning-requests' });
}

function getStatusSeverity(status) {
    const map = { pending: 'info', in_progress: 'warn', completed: 'success', cancelled: 'danger' };
    return map[status] || 'info';
}
</script>

<template>
  <div class="request-detail">
    <el-button label="Back to Requests" icon="pi pi-arrow-left" variant="ghost" @click="goBack" />

    <div v-if="store.isLoading" class="request-detail__loading">
      <pv-skeleton width="240px" height="28px" borderRadius="4px" />
      <pv-skeleton width="100%" height="200px" borderRadius="12px" class="request-detail__skeleton-card" />
    </div>
    <template v-else-if="store.currentRequest">
      <h2 class="request-detail__title">Request #{{ store.currentRequest.requestId }}</h2>
      <pv-card class="request-detail__card">
        <template #content>
          <div class="request-detail__grid">
            <div class="request-detail__row">
              <span class="request-detail__label">Status</span>
              <pv-tag :value="store.currentRequest.status" :severity="getStatusSeverity(store.currentRequest.status)" />
            </div>
            <div class="request-detail__row">
              <span class="request-detail__label">Property</span>
              <span class="request-detail__value">{{ store.currentRequest.propertyId || 'Not selected' }}</span>
            </div>
            <div class="request-detail__row">
              <span class="request-detail__label">Category</span>
              <span class="request-detail__value">{{ store.currentRequest.requestedCategory || 'Not selected' }}</span>
            </div>
            <div class="request-detail__row">
              <span class="request-detail__label">Priority</span>
              <span class="request-detail__value">{{ store.currentRequest.isPriority ? 'Yes' : 'No' }}</span>
            </div>
            <div class="request-detail__row">
              <span class="request-detail__label">IoT Device</span>
              <span class="request-detail__value">{{ store.currentRequest.hasIoTDevice ? 'Connected' : 'None' }}</span>
            </div>
            <div class="request-detail__row">
              <span class="request-detail__label">Technician</span>
              <span class="request-detail__value">{{ store.currentRequest.assignedTechnicianId || 'Pending assignment' }}</span>
            </div>
          </div>
        </template>
      </pv-card>
    </template>
  </div>
</template>

<style scoped>
.request-detail__title { margin: 1.5rem 0; color: var(--el-primary); }

.request-detail__loading { display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; }
.request-detail__skeleton-card { margin-top: 0.5rem; }

.request-detail__card { border: 1px solid rgba(169, 177, 186, 0.2); border-radius: 12px; }
.request-detail__grid { display: grid; grid-template-columns: 1fr; gap: 0.75rem; }
@media (min-width: 768px) { .request-detail__grid { grid-template-columns: 1fr 1fr; } }
.request-detail__row { display: flex; flex-direction: column; gap: 0.15rem; }
.request-detail__label { font-size: 0.8rem; font-weight: 600; color: var(--el-warm-gray); text-transform: uppercase; letter-spacing: 0.05em; }
.request-detail__value { font-size: 0.95rem; color: var(--el-primary); }
</style>
