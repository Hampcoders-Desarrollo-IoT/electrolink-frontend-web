<script setup>
// el-confirm-dialog is a styling-only wrapper around PrimeVue's ConfirmDialog.
// No additional props needed — all configuration is done via useConfirm().
</script>

<template>
  <pv-confirm-dialog class="el-confirm-dialog" />
</template>

<style scoped>
:deep(.p-dialog) {
  border-radius: 0.75rem !important;
  background-color: #ffffff !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid #e5e7eb !important;
  overflow: hidden;
  max-width: 420px;
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
}

:deep(.p-dialog-content) {
  padding: 1.5rem !important;
  background-color: #ffffff !important;
  color: #374151 !important;
  font-size: 0.95rem;
  line-height: 1.5;
}

:deep(.p-dialog-footer) {
  padding: 1rem 1.5rem !important;
  border-top: 1px solid #f3f4f6 !important;
  background-color: #ffffff !important;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Style the reject button as ghost */
:deep(.p-dialog-footer .p-confirm-dialog-reject) {
  background-color: transparent !important;
  color: var(--el-primary) !important;
  border: 1px solid rgba(46, 58, 89, 0.2) !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.5rem 1.25rem !important;
}

:deep(.p-dialog-footer .p-confirm-dialog-reject:hover) {
  background-color: rgba(46, 58, 89, 0.05) !important;
}

/* Style the accept button as danger */
:deep(.p-dialog-footer .p-confirm-dialog-accept) {
  background-color: var(--el-danger) !important;
  color: white !important;
  border: none !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  padding: 0.5rem 1.25rem !important;
}

:deep(.p-dialog-footer .p-confirm-dialog-accept:hover) {
  opacity: 0.9;
}

/* Warning icon styling */
:deep(.p-confirm-dialog-icon) {
  color: #f97316 !important;
  font-size: 1.5rem !important;
}
</style>
