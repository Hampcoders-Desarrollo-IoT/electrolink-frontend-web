<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  modelValue: String,
  placeholder: String,
  label: String,
  rows: {
    type: Number,
    default: 4
  },
  disabled: Boolean,
  required: Boolean,
  error: String,
  autoResize: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="el-textarea-group">
    <label v-if="label" :for="id" class="el-textarea-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <pv-textarea
      :id="id"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
      :placeholder="placeholder"
      :rows="rows"
      :disabled="disabled"
      :autoResize="autoResize"
      :class="['el-textarea-field', { 'el-textarea-field--error': error }]"
    />
    
    <small v-if="error" class="el-textarea-error-msg">{{ error }}</small>
  </div>
</template>

<style scoped>
.el-textarea-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.el-textarea-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.required-mark {
  color: var(--el-danger);
  margin-left: 0.25rem;
}

.el-textarea-field {
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
  font-family: inherit !important;
}

.el-textarea-field:focus {
  border-color: #392D58 !important;
  box-shadow: 0 0 0 1px #392D58 !important;
  background-color: white !important;
}

.el-textarea-field--error {
  border-color: var(--el-danger) !important;
}

.el-textarea-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}
</style>
