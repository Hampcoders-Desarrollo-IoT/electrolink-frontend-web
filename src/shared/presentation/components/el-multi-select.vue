<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  modelValue: {
    type: Array,
    default: () => []
  },
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
  display: {
    type: String,
    default: 'comma'
  },
  maxSelectedLabels: {
    type: Number,
    default: 10
  },
  selectedItemsLabel: {
    type: String,
    default: '{0} items selected'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const onChange = (event) => {
  emit('update:modelValue', event);
  emit('change', event);
};
</script>

<template>
  <div class="el-multi-select-group">
    <label v-if="label" :for="id" class="el-multi-select-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <pv-multi-select
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
      :display="display"
      :maxSelectedLabels="maxSelectedLabels"
      :selectedItemsLabel="selectedItemsLabel"
      :class="['el-multi-select-field', { 'el-multi-select-field--error': error }]"
      panelClass="el-multi-select-panel"
    />
    
    <small v-if="error" class="el-multi-select-error-msg">{{ error }}</small>
  </div>
</template>

<style scoped>
.el-multi-select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.el-multi-select-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.required-mark {
  color: var(--el-danger);
  margin-left: 0.25rem;
}

:deep(.p-multiselect) {
  width: 100% !important;
  height: 2.875rem !important;
  border-radius: 8px !important;
  border: 1px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
  display: flex !important;
  align-items: center !important;
  overflow: hidden !important;
}

:deep(.p-multiselect:not(.p-disabled).p-focus) {
  border-color: #392D58 !important;
  box-shadow: 0 0 0 1px #392D58 !important;
  background-color: white !important;
}

:deep(.p-multiselect-label) {
  padding: 0 1rem !important;
  color: #2E3A59 !important;
  font-size: 0.95rem;
  line-height: 2.875rem !important;
  background: transparent !important;
  border: none !important;
  display: flex !important;
  align-items: center !important;
  gap: 0 !important;
  margin: 0 !important;
  min-height: 100% !important;
  width: 100% !important;
  flex: 1 1 auto !important;
}

:deep(.p-multiselect-label-empty),
:deep(.p-multiselect-placeholder),
:deep(.p-multiselect-label.p-placeholder),
:deep(.p-multiselect-items-label) {
  padding: 0 1rem !important;
  display: flex !important;
  align-items: center !important;
  margin: 0 !important;
  height: 100% !important;
  width: 100% !important;
}

.el-multi-select-field--error :deep(.p-multiselect) {
  border-color: var(--el-danger) !important;
}

.el-multi-select-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}
</style>

<style>
/* Global styles for the panel (teleported) */
.el-multi-select-panel {
  background-color: white !important;
  border-radius: 12px !important;
  padding: 0.5rem !important;
  border: 1px solid rgba(169, 177, 186, 0.2) !important;
  box-shadow: 0 10px 25px -5px rgba(46, 58, 89, 0.1) !important;
}

.el-multi-select-panel .p-multiselect-option {
  padding: 0.75rem 1rem !important;
  border-radius: 8px !important;
  color: var(--el-primary) !important;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.el-multi-select-panel .p-multiselect-option.p-highlight {
  background-color: rgba(46, 58, 89, 0.05) !important;
  color: var(--el-primary) !important;
}

.el-multi-select-panel .p-multiselect-option:not(.p-highlight):not(.p-disabled).p-focus {
  background-color: rgba(232, 238, 246, 0.5) !important;
}

.el-multi-select-panel .p-checkbox {
  border-radius: 4px !important;
}

.el-multi-select-panel .p-checkbox-box {
  border-radius: 4px !important;
  border: 1px solid rgba(169, 177, 186, 0.5) !important;
}
</style>
