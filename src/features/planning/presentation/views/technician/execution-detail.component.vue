<script setup>
import { useRoute } from 'vue-router';
import ExecutionDetail from '../../components/execution/execution-detail.component.vue';

const route = useRoute();
</script>

<template>
  <div class="execution-detail-page">
    <ExecutionDetail :execution-id="route.params.id" />
  </div>
</template>
