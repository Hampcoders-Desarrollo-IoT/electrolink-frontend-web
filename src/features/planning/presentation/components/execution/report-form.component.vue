<script setup>
import { ref } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();
const report = ref(store.currentExecution?.report || '');
const isSaving = ref(false);

async function saveReport() {
    isSaving.value = true;
    try {
        // await store.updateReport(props.executionId, { report: report.value });
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
  <div class="report-form">
    <h4 class="report-form__title">Technical Report</h4>
    <el-textarea v-model="report" placeholder="Write your technical report..." class="report-form__textarea" />
    <el-button :label="isSaving ? 'Saving...' : 'Save Report'" icon="pi pi-save" :disabled="isSaving" @click="saveReport" class="report-form__btn" />
  </div>
</template>

<style scoped>
.report-form__title { margin: 0 0 1rem; color: var(--el-primary); }
.report-form__textarea { width: 100%; min-height: 150px; }
.report-form__btn { margin-top: 0.75rem; }
</style>
