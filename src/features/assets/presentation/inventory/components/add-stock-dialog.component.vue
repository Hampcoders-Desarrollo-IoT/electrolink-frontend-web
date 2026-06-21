<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    visible: Boolean,
    components: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['confirm', 'cancel']);

const selectedComponent = ref(null);
const quantity = ref(0);
const alertThreshold = ref(5);

const componentOptions = computed(() =>
    props.components.map(c => ({ label: `${c.name} (${c.sku})`, value: c.id }))
);

function onConfirm() {
    emit('confirm', {
        componentId: selectedComponent.value,
        quantity: quantity.value,
        alertThreshold: alertThreshold.value
    });
    resetForm();
}

function onCancel() {
    emit('cancel');
    resetForm();
}

function resetForm() {
    selectedComponent.value = null;
    quantity.value = 0;
    alertThreshold.value = 5;
}
</script>

<template>
  <pv-dialog
    :visible="visible"
    @update:visible="val => !val && onCancel()"
    modal
    header="Add Component Stock"
    :style="{ width: '480px' }"
    :draggable="false"
    class="add-stock-dialog"
  >
    <template #header>
      <div class="add-stock-dialog__header">
        <div class="add-stock-dialog__header-icon">
          <i class="pi pi-box"></i>
        </div>
        <div>
          <h3 class="add-stock-dialog__title">Add Component Stock</h3>
          <p class="add-stock-dialog__subtitle">Update inventory for ElectroLink Technicians</p>
        </div>
      </div>
    </template>

    <div class="add-stock-dialog__body">
      <el-select
        v-model="selectedComponent"
        :options="componentOptions"
        optionLabel="label"
        optionValue="value"
        label="Component"
        placeholder="Select a component..."
        required
      />

      <div class="add-stock-dialog__row">
        <div class="add-stock-dialog__field">
          <label class="add-stock-dialog__label">
            <i class="pi pi-box"></i> Quantity
          </label>
          <pv-input-number v-model="quantity" :min="0" suffix=" Units" class="add-stock-dialog__input" />
        </div>

        <div class="add-stock-dialog__field">
          <label class="add-stock-dialog__label">
            <i class="pi pi-bell"></i> Alert Threshold
          </label>
          <pv-input-number v-model="alertThreshold" :min="0" suffix=" Min" class="add-stock-dialog__input" />
        </div>
      </div>

      <pv-message severity="warn" :closable="false" class="add-stock-dialog__note">
        Adding stock will update the global technician inventory. The alert
        threshold will trigger a notification when stock falls below this level.
      </pv-message>
    </div>

    <template #footer>
      <div class="add-stock-dialog__footer">
        <el-button variant="ghost" label="Cancel" @click="onCancel" />
        <el-button variant="primary" icon="pi pi-check" label="Confirm Add Stock" @click="onConfirm" :disabled="!selectedComponent || quantity <= 0" />
      </div>
    </template>
  </pv-dialog>
</template>

<style scoped>
.add-stock-dialog__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.add-stock-dialog__header-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background-color: var(--el-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.add-stock-dialog__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--el-primary);
}

.add-stock-dialog__subtitle {
  margin: 0.125rem 0 0;
  font-size: 0.8rem;
  color: var(--el-warm-gray);
}

.add-stock-dialog__body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.add-stock-dialog__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.add-stock-dialog__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.add-stock-dialog__label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--el-primary);
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.add-stock-dialog__input {
  width: 100%;
}

:deep(.add-stock-dialog__input .p-inputnumber-input) {
  width: 100%;
  border-radius: 8px !important;
  border: 1px solid rgba(169, 177, 186, 0.4) !important;
  background-color: rgba(232, 238, 246, 0.3) !important;
  padding: 0.75rem 1rem !important;
}

.add-stock-dialog__note {
  margin: 0;
}

.add-stock-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}
</style>
