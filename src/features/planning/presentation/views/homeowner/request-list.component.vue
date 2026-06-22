<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const router = useRouter();
const store = useServiceRequestStore();
const requests = ref([]);

onMounted(async () => {
    await store.fetchEligibility();
});

function newRequest() {
    router.push({ name: 'planning-request-wizard' });
}

function viewDetail(requestId) {
    router.push({ name: 'planning-request-detail', params: { id: requestId } });
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
    <div v-if="requests.length === 0" class="request-list__empty">
      <i class="pi pi-inbox request-list__empty-icon"></i>
      <p>No service requests yet</p>
      <el-button v-if="store.isEligible" label="Create your first request" @click="newRequest" />
    </div>
  </div>
</template>

<style scoped>
.request-list__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.request-list__title { margin: 0; color: var(--el-primary); }
.request-list__eligibility { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.85rem; color: var(--el-warm-gray); }
.request-list__empty { text-align: center; padding: 4rem; color: var(--el-warm-gray); }
.request-list__empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; display: block; }
</style>
