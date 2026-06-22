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
</script>

<template>
  <div class="company-requests">
    <div class="company-requests__header">
      <div>
        <h2 class="company-requests__title">Service Requests</h2>
        <p class="company-requests__subtitle">Manage service requests for all your properties</p>
      </div>
      <el-button v-if="store.isEligible" label="New Request" icon="pi pi-plus" @click="newRequest" />
    </div>
    <div v-if="requests.length === 0" class="company-requests__empty">
      <i class="pi pi-building company-requests__empty-icon"></i>
      <p>No requests yet for your company</p>
      <el-button v-if="store.isEligible" label="Create a request" @click="newRequest" />
    </div>
  </div>
</template>

<style scoped>
.company-requests__header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.company-requests__title { margin: 0; color: var(--el-primary); }
.company-requests__subtitle { margin: 0.25rem 0 0; color: var(--el-warm-gray); font-size: 0.9rem; }
.company-requests__empty { text-align: center; padding: 4rem; color: var(--el-warm-gray); }
.company-requests__empty-icon { font-size: 2.5rem; margin-bottom: 0.5rem; display: block; }
</style>
