<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number, Boolean, Object],
  options: {
    type: Array,
    required: true
  },
  optionLabel: {
    type: String,
    default: 'label'
  },
  optionValue: {
    type: String,
    default: 'value'
  },
  disabled: Boolean,
  label: String
});

const emit = defineEmits(['update:modelValue', 'change']);

const onChange = (event) => {
  emit('update:modelValue', event);
  emit('change', event);
};
</script>

<template>
  <div class="el-switcher-group">
    <label v-if="label" class="el-switcher-label">{{ label }}</label>
    <pv-select-button
      :modelValue="modelValue"
      @update:modelValue="onChange"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :disabled="disabled"
      class="el-switcher"
    />
  </div>
</template>

<style scoped>
.el-switcher-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.el-switcher-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
}

:deep(.p-selectbutton) {
  display: flex;
  background-color: rgba(232, 238, 246, 0.3) !important;
  border-radius: 14px !important;
  padding: 4px !important;
  border: 1px solid rgba(169, 177, 186, 0.3) !important;
}

:deep(.p-button) {
  flex: 1;
  border-radius: 10px !important;
  border: none !important;
  background: transparent !important;
  color: var(--el-warm-gray) !important;
  font-weight: 600 !important;
  font-size: 0.875rem !important;
  padding: 0.625rem 1rem !important;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  box-shadow: none !important;
}

:deep(.p-button.p-highlight) {
  background: white !important;
  color: var(--el-primary) !important;
  box-shadow: 0 4px 12px rgba(46, 58, 89, 0.1) !important;
}

:deep(.p-button:not(.p-highlight):hover) {
  background: rgba(46, 58, 89, 0.03) !important;
  color: var(--el-primary) !important;
}
</style>
