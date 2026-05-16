<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  id: String,
  modelValue: Boolean,
  label: String,
  description: String,
  disabled: Boolean,
  binary: {
    type: Boolean,
    default: true
  },
  variant: {
    type: String,
    default: 'default' // 'default' | 'card'
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

const onChange = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
};
</script>

<template>
  <div 
    :class="[
      'el-checkbox-group', 
      `el-checkbox--${variant}`,
      { 'el-checkbox--disabled': disabled }
    ]"
    @click="!disabled && onChange(!modelValue)"
  >
    <pv-checkbox
      :id="id"
      :inputId="id"
      :modelValue="modelValue"
      @update:modelValue="onChange"
      :disabled="disabled"
      :binary="binary"
      class="el-checkbox"
      @click.stop
    />
    
    <div class="el-checkbox-content">
      <label v-if="label" :for="id" class="el-checkbox-label">
        {{ label }}
      </label>
      <span v-if="description" class="el-checkbox-description">
        {{ description }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.el-checkbox-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}

.el-checkbox--disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.el-checkbox-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
  cursor: pointer;
  display: block;
}

.el-checkbox-description {
  font-size: 0.75rem;
  color: var(--el-warm-gray);
  display: block;
  margin-top: 0.125rem;
}

/* Card Variant */
.el-checkbox--card {
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid rgba(169, 177, 186, 0.25);
  background-color: transparent;
  width: 100%;
}

.el-checkbox--card:hover:not(.el-checkbox--disabled) {
  border-color: var(--el-primary);
  background-color: rgba(232, 238, 246, 0.4);
}

.el-checkbox--card.el-checkbox--active {
  border-color: var(--el-primary);
  background-color: rgba(232, 238, 246, 0.2);
}

.el-checkbox-content {
  display: flex;
  flex-direction: column;
}

/* Base PrimeVue Checkbox Customization */
:deep(.p-checkbox) {
  width: 20px;
  height: 20px;
}

:deep(.p-checkbox-box) {
  border-radius: 6px !important;
  border: 2px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  transition: all 0.2s ease !important;
}

:deep(.p-checkbox-box.p-highlight) {
  background-color: var(--el-primary) !important;
  border-color: var(--el-primary) !important;
}

:deep(.p-checkbox:not(.p-disabled):hover .p-checkbox-box) {
  border-color: var(--el-primary) !important;
}

:deep(.p-checkbox-icon) {
  font-size: 0.7rem;
  color: white !important;
}
</style>
