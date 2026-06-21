<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  visible: { type: Boolean, default: false },
  header: { type: String, default: '' },
  width: { type: String, default: '450px' },
  modal: { type: Boolean, default: true },
  draggable: { type: Boolean, default: false },
  closable: { type: Boolean, default: true }
});

const emit = defineEmits(['update:visible', 'close', 'show']);

function onHide() {
  emit('update:visible', false);
  emit('close');
}
</script>

<template>
  <pv-dialog
    :visible="visible"
    @update:visible="val => emit('update:visible', val)"
    :header="header"
    :modal="modal"
    :draggable="draggable"
    :closable="closable"
    :style="{ width }"
    class="el-dialog"
    @hide="onHide"
    @show="emit('show')"
  >
    <div class="el-dialog__body">
      <slot></slot>
    </div>

    <template v-if="$slots.footer" #footer>
      <div class="el-dialog__footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
:deep(.p-dialog) {
  border-radius: 0.75rem !important;
  background-color: #ffffff !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden;
}

:deep(.p-dialog-header) {
  padding: 1.25rem 1.5rem !important;
  border-bottom: 1px solid #f3f4f6 !important;
  background-color: #ffffff !important;
}

:deep(.p-dialog-title) {
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  color: #111827 !important;
  letter-spacing: -0.01em;
}

:deep(.p-dialog-header-actions .p-button) {
  color: #9ca3af !important;
  width: 2rem !important;
  height: 2rem !important;
}

:deep(.p-dialog-header-actions .p-button:hover) {
  background-color: #f3f4f6 !important;
  color: #111827 !important;
}

:deep(.p-dialog-content) {
  padding: 1.5rem !important;
  background-color: #ffffff !important;
}

:deep(.p-dialog-footer) {
  padding: 1rem 1.5rem !important;
  border-top: 1px solid #f3f4f6 !important;
  background-color: #ffffff !important;
}

.el-dialog__body {
  display: flex;
  flex-direction: column;
}

.el-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
