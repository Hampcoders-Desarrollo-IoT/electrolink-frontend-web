<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  modelValue: [String, Number, Object],
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
  placeholder: String,
  label: String,
  disabled: Boolean,
  required: Boolean,
  error: String,
  fluid: {
    type: Boolean,
    default: true
  },
  filterable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const onChange = (event) => {
  emit('update:modelValue', event);
  emit('change', event);
};
</script>

<template>
  <div class="el-select-group">
    <label v-if="label" :for="id" class="el-select-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <pv-select
      :id="id"
      :inputId="id"
      :modelValue="modelValue"
      @update:modelValue="onChange"
      :options="options"
      :optionLabel="optionLabel"
      :optionValue="optionValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :fluid="fluid"
      :filter="filterable"
      :class="['el-select-field', { 'el-select-field--error': error }]"
      panelClass="el-select-panel"
    />
    
    <small v-if="error" class="el-select-error-msg">{{ error }}</small>
  </div>
</template>

<style scoped>
.el-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.el-select-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.required-mark {
  color: var(--el-danger);
  margin-left: 0.25rem;
}

/* Custom Select Styling */
:deep(.p-select) {
  width: 100%;
  border-radius: 8px !important;
  border: 1px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
}

:deep(.p-select:not(.p-disabled).p-focus) {
  border-color: #392D58 !important;
  box-shadow: 0 0 0 1px #392D58 !important;
  background-color: white !important;
}

:deep(.p-select-label) {
  padding: 0.75rem 1rem !important;
  color: #2E3A59 !important;
  font-size: 0.95rem;
  background: transparent !important;
  border: none !important;
  display: flex;
  align-items: center;
}

.el-select-field--error :deep(.p-select) {
  border-color: var(--el-danger) !important;
}

.el-select-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}
</style>

<style>
/* Global styles for the panel (teleported) */
.el-select-panel {
  background-color: white !important;
  border-radius: 12px !important;
  padding: 0.5rem !important;
  border: 1px solid rgba(169, 177, 186, 0.2) !important;
  box-shadow: 0 10px 25px -5px rgba(46, 58, 89, 0.1) !important;
}

.el-select-panel .p-select-option {
  padding: 0.75rem 1rem !important;
  border-radius: 8px !important;
  color: var(--el-primary) !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

.el-select-panel .p-select-option.p-highlight {
  background-color: rgba(46, 58, 89, 0.05) !important;
  color: var(--el-primary) !important;
  font-weight: 700 !important;
}

.el-select-panel .p-select-option:not(.p-highlight):not(.p-disabled).p-focus {
  background-color: rgba(232, 238, 246, 0.5) !important;
}
</style>
