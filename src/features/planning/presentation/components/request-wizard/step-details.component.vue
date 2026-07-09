<script setup>
import { ref } from 'vue';

const emit = defineEmits(['complete', 'back']);

const description = ref('');
const preferredDate = ref(null);
const notes = ref('');

function submit() {
    emit('complete', { description: description.value, preferredDate: preferredDate.value, notes: notes.value });
}
</script>

<template>
  <div class="step-details">
    <h3 class="step-details__title">Service Details</h3>
    <p class="step-details__subtitle">Provide additional information about your request</p>
    <div class="step-details__form">
      <div class="step-details__field">
        <label>Description</label>
        <el-textarea v-model="description" placeholder="Describe the electrical issue..." />
      </div>
      <div class="step-details__field">
        <label>Preferred Date</label>
        <el-datepicker v-model="preferredDate" placeholder="Select a date" />
      </div>
      <div class="step-details__field">
        <label>Additional Notes</label>
        <el-textarea v-model="notes" placeholder="Any additional information..." />
      </div>
    </div>
    <div class="step-details__actions">
      <el-button label="Back" icon="pi pi-chevron-left" variant="text" @click="emit('back')" />
      <el-button label="Continue" icon="pi pi-chevron-right" icon-pos="right" @click="submit" />
    </div>
  </div>
</template>

<style scoped>
.step-details__title { margin: 0 0 0.25rem; color: var(--el-primary); }
.step-details__subtitle { margin: 0 0 1.5rem; color: var(--el-warm-gray); font-size: 0.9rem; }
.step-details__form { max-width: 600px; display: flex; flex-direction: column; gap: 1.25rem; }
.step-details__field { display: flex; flex-direction: column; gap: 0.5rem; }
.step-details__field label { font-weight: 600; font-size: 0.85rem; color: var(--el-primary); }
.step-details__actions { margin-top: 2rem; display: flex; gap: 1rem; justify-content: space-between; }
</style>
