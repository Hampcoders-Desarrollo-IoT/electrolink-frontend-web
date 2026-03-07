<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Date],
  placeholder: String,
  label: String,
  dateFormat: {
    type: String,
    default: 'yy-mm-dd'
  },
  disabled: Boolean,
  required: Boolean,
  error: String,
  fluid: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="el-datepicker-group">
    <label v-if="label" class="el-datepicker-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <pv-datepicker
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :dateFormat="dateFormat"
      :disabled="disabled"
      :fluid="fluid"
      :class="['el-datepicker-field', { 'el-datepicker-field--error': error }]"
    />
    
    <small v-if="error" class="el-datepicker-error-msg">{{ error }}</small>
  </div>
</template>

<style scoped>
.el-datepicker-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.el-datepicker-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.required-mark {
  color: var(--el-danger);
  margin-left: 0.25rem;
}

:deep(.p-datepicker) {
  width: 100%;
}

:deep(.p-inputtext) {
  width: 100%;
  border-radius: 8px !important;
  border: 1px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  padding: 0.75rem 1rem !important;
  color: #2E3A59 !important;
  transition: all 0.2s ease !important;
  outline: none !important;
  box-shadow: none !important;
  font-size: 0.95rem;
}

:deep(.p-inputtext:focus) {
  border-color: #392D58 !important;
  box-shadow: 0 0 0 1px #392D58 !important;
  background-color: white !important;
}

.el-datepicker-field--error :deep(.p-inputtext) {
  border-color: var(--el-danger) !important;
}

.el-datepicker-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}
</style>
