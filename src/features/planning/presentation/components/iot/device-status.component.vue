<script setup>
const props = defineProps({
    isOnline: { type: Boolean, default: false },
    lastReading: { type: String, default: '' }
});
</script>

<template>
  <div :class="['device-status', { 'device-status--online': isOnline, 'device-status--offline': !isOnline }]">
    <i class="pi pi-signal device-status__icon"></i>
    <div class="device-status__info">
      <strong class="device-status__label">{{ isOnline ? 'Online' : 'Offline' }}</strong>
      <span v-if="lastReading" class="device-status__reading">Last reading: {{ lastReading }}</span>
    </div>
    <pv-tag :value="isOnline ? 'Active' : 'Inactive'" :severity="isOnline ? 'success' : 'danger'" />
  </div>
</template>

<style scoped>
.device-status {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem; border-radius: 12px; border: 1px solid;
}
.device-status--online { background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2); }
.device-status--offline { background: rgba(239, 68, 68, 0.05); border-color: rgba(239, 68, 68, 0.2); }
.device-status__icon { font-size: 1.2rem; }
.device-status--online .device-status__icon { color: var(--el-success); }
.device-status--offline .device-status__icon { color: var(--el-danger); }
.device-status__info { flex: 1; }
.device-status__label { display: block; font-size: 0.9rem; color: var(--el-primary); }
.device-status__reading { font-size: 0.75rem; color: var(--el-warm-gray); }
</style>
