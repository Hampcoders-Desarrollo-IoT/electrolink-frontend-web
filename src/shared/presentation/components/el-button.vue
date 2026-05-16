<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  label: String,
  icon: String,
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'ghost', 'danger'].includes(value)
  },
  loading: Boolean,
  disabled: Boolean,
  type: {
    type: String,
    default: 'button'
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <pv-button
    :id="id"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disabled="disabled"
    :type="type"
    :class="['el-button', `el-button--${variant}`]"
    @click="emit('click', $event)"
  >
    <slot v-if="!label"></slot>
  </pv-button>
</template>

<style scoped>
.el-button {
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  transition: all 0.2s ease !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 0.5rem !important;
  font-family: inherit !important;
}

.el-button--primary {
  background-color: var(--el-primary) !important;
  color: white !important;
}

.el-button--primary:hover:not(:disabled) {
  background-color: #3d4a6d !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(46, 58, 89, 0.2);
}

.el-button--secondary {
  background-color: var(--el-bg-soft) !important;
  color: var(--el-primary) !important;
  border: 1px solid rgba(46, 58, 89, 0.1) !important;
}

.el-button--secondary:hover:not(:disabled) {
  background-color: #dee5f0 !important;
  border-color: rgba(46, 58, 89, 0.2) !important;
}

.el-button--ghost {
  background-color: transparent !important;
  color: var(--el-primary) !important;
  border: 1px solid rgba(46, 58, 89, 0.2) !important;
}

.el-button--ghost:hover:not(:disabled) {
  background-color: rgba(46, 58, 89, 0.05) !important;
}

.el-button--danger {
  background-color: var(--el-danger) !important;
  color: white !important;
}

.el-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.p-button-icon) {
  font-size: 1rem;
}
</style>
