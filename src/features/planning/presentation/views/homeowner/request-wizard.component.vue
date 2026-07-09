<script setup>
import { useRoute, useRouter } from 'vue-router';
import WizardContainer from '../../components/request-wizard/wizard-container.component.vue';

const route = useRoute();
const router = useRouter();

function onComplete() {
    router.push({ name: 'planning-requests' });
}
</script>

<template>
  <div class="request-wizard">
    <h2 class="request-wizard__title">New Service Request</h2>
    <WizardContainer :request-id="route.params.id" @complete="onComplete" />
  </div>
</template>

<style scoped>
.request-wizard__title { margin: 0 0 1.5rem; color: var(--el-primary); }
</style>
