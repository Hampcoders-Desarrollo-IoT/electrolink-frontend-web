<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: String,
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'danger', 'primary'].includes(value)
  },
  icon: String,
  removable: Boolean
});

const emit = defineEmits(['remove']);
</script>

<template>
  <div :class="['el-chip', `el-chip--${variant}`]">
    <i v-if="icon" :class="[icon, 'el-chip-icon']"></i>
    <span class="el-chip-label">{{ label }}</span>
    <i v-if="removable" class="pi pi-times el-chip-remove" @click.stop="emit('remove')"></i>
  </div>
</template>

<style scoped>
.el-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
}

.el-chip-icon {
  font-size: 0.875rem;
}

.el-chip-remove {
  font-size: 0.75rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.el-chip-remove:hover {
  opacity: 1;
}

/* Variants */
.el-chip--primary {
  background-color: rgba(46, 58, 89, 0.1);
  color: var(--el-primary);
}

.el-chip--info {
  background-color: rgba(25, 120, 229, 0.1);
  color: var(--el-custom);
}

.el-chip--success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--el-success);
}

.el-chip--warning {
  background-color: rgba(255, 228, 146, 0.2);
  color: #b45309;
}

.el-chip--danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--el-danger);
}
</style>
