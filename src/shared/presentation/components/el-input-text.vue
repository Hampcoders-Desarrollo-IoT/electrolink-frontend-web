<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  placeholder: String,
  label: String,
  icon: String,
  type: {
    type: String,
    default: 'text'
  },
  disabled: Boolean,
  readonly: Boolean,
  required: Boolean,
  error: String,
  mask: String
});

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'change']);

const onInput = (event) => {
  emit('update:modelValue', event);
};
</script>

<template>
  <div class="el-input-group">
    <label v-if="label" class="el-input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div :class="['el-input-wrapper', { 'el-input-wrapper--icon': icon, 'el-input-wrapper--error': error }]">
      <i v-if="icon" :class="[icon, 'el-input-icon']"></i>
      
      <pv-input-text
        :modelValue="modelValue"
        @update:modelValue="onInput"
        :placeholder="placeholder"
        :type="type"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        class="el-input-field"
        @blur="emit('blur', $event)"
        @focus="emit('focus', $event)"
        @change="emit('change', $event)"
      />
    </div>
    
    <small v-if="error" class="el-input-error-msg">{{ error }}</small>
  </div>
</template>

<style scoped>
.el-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.el-input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.required-mark {
  color: var(--el-danger);
  margin-left: 0.25rem;
}

.el-input-wrapper {
  position: relative;
  width: 100%;
}

.el-input-field {
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

.el-input-field:focus {
  border-color: #392D58 !important;
  box-shadow: 0 0 0 1px #392D58 !important;
  background-color: white !important;
}

.el-input-field:disabled {
  opacity: 0.6;
  background-color: rgba(0, 0, 0, 0.05) !important;
}

.el-input-wrapper--error .el-input-field {
  border-color: var(--el-danger) !important;
}

.el-input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--el-warm-gray);
  z-index: 10;
  font-size: 1rem;
}

.el-input-wrapper--icon .el-input-field {
  padding-left: 2.75rem !important;
}

.el-input-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}
</style>
