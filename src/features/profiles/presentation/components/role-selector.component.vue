<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'I am a...'
  }
});

const emit = defineEmits(['update:modelValue']);

const selectRole = (role) => {
  emit('update:modelValue', role);
};
</script>

<template>
  <div class="role-selector-container">
    <label v-if="label" class="role-selector-label">{{ label }}</label>
    <div class="role-btn-group">
      <button
        type="button"
        class="role-btn"
        :class="{ 'role-btn-active': modelValue === 'TECHNICIAN' }"
        @click="selectRole('TECHNICIAN')"
      >
        Technician
      </button>
      <button
        type="button"
        class="role-btn"
        :class="{ 'role-btn-active': modelValue === 'HOMEOWNER' }"
        @click="selectRole('HOMEOWNER')"
      >
        Homeowner
      </button>
    </div>
  </div>
</template>

<style scoped>
.role-selector-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.role-selector-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
}

.role-btn-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid rgba(169, 177, 186, 0.3);
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 2.5rem;
}

.role-btn {
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background-color: white;
  color: var(--el-warm-gray);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.role-btn:hover:not(.role-btn-active) {
  background-color: var(--el-bg-soft);
  color: var(--el-primary);
}

.role-btn-active {
  background-color: var(--el-primary);
  color: white;
}
</style>
