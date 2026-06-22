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
</script>

<template>
  <div class="request-detail">
    <el-button label="Back to Requests" icon="pi pi-arrow-left" variant="text" @click="goBack" />
    <div v-if="store.currentRequest" class="request-detail__card">
      <h2 class="request-detail__title">Request #{{ store.currentRequest.requestId }}</h2>
      <div class="request-detail__grid">
        <div class="request-detail__row"><strong>Status:</strong> <pv-tag :value="store.currentRequest.status" /></div>
        <div class="request-detail__row"><strong>Property:</strong> {{ store.currentRequest.propertyId || 'Not selected' }}</div>
        <div class="request-detail__row"><strong>Category:</strong> {{ store.currentRequest.requestedCategory || 'Not selected' }}</div>
        <div class="request-detail__row"><strong>Priority:</strong> {{ store.currentRequest.isPriority ? 'Yes' : 'No' }}</div>
        <div class="request-detail__row"><strong>IoT Device:</strong> {{ store.currentRequest.hasIoTDevice ? 'Connected' : 'None' }}</div>
        <div class="request-detail__row"><strong>Technician:</strong> {{ store.currentRequest.assignedTechnicianId || 'Pending assignment' }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.request-detail__card { background: white; border: 1px solid rgba(169, 177, 186, 0.2); border-radius: 12px; padding: 1.5rem; margin-top: 1rem; }
.request-detail__title { margin: 0 0 1.5rem; color: var(--el-primary); }
.request-detail__grid { display: flex; flex-direction: column; gap: 0.75rem; }
.request-detail__row { font-size: 0.9rem; color: var(--el-primary); }
.request-detail__row strong { color: var(--el-warm-gray); margin-right: 0.5rem; }
</style>
