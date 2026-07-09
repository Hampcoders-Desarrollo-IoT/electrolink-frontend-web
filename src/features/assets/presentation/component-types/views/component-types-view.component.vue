<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useComponentTypeStore } from '../../../application/component-type.store.js';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ComponentTypeTable from '../components/component-type-table.component.vue';
import ComponentTypeModal from '../components/component-type-modal.component.vue';

const route = useRoute();
const componentTypeStore = useComponentTypeStore();
const confirm = useConfirm();
const toast = useToast();

const isModalVisible = ref(false);
const technicianId = () => route.params.technicianId;

onMounted(() => {
    componentTypeStore.loadComponentTypes(technicianId());
});

function openNew() {
    componentTypeStore.clearSelection();
    isModalVisible.value = true;
}

async function handleSave(formData) {
    const id = technicianId();
    if (componentTypeStore.selectedComponentType) {
        // Edit mode
        const updated = await componentTypeStore.updateComponentType(id, componentTypeStore.selectedComponentType.id, formData);
        if (updated) {
            toast.add({ severity: 'success', summary: 'Updated', detail: `Component type "${updated.id}" updated successfully.`, life: 3000 });
            closeModal();
        }
    } else {
        // Create mode
        const created = await componentTypeStore.createComponentType(id, formData);
        if (created) {
            toast.add({ severity: 'success', summary: 'Created', detail: `Component type "${created.id}" created successfully.`, life: 3000 });
            closeModal();
        }
    }
}

function closeModal() {
    isModalVisible.value = false;
    componentTypeStore.clearSelection();
}

function handleEdit(item) {
    componentTypeStore.selectComponentType(item);
    isModalVisible.value = true;
}

function handleDelete(item) {
    confirm.require({
        message: `Are you sure you want to delete component type "${item.id}"?`,
        header: 'Delete Component Type',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-text',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await componentTypeStore.deleteComponentType(technicianId(), item.id);
            toast.add({ severity: 'info', summary: 'Deleted', detail: `Component type "${item.id}" has been deleted.`, life: 3000 });
        }
    });
}

async function handleActivate(item) {
    const result = await componentTypeStore.activateComponentType(technicianId(), item.id);
    if (result) {
        toast.add({ severity: 'success', summary: 'Activated', detail: `Component type "${item.id}" is now active.`, life: 3000 });
    }
}

async function handleDeactivate(item) {
    const result = await componentTypeStore.deactivateComponentType(technicianId(), item.id);
    if (result) {
        toast.add({ severity: 'warn', summary: 'Deactivated', detail: `Component type "${item.id}" has been deactivated.`, life: 3000 });
    }
}
</script>

<template>
  <div class="ct-view">
    <div class="ct-view__container">
      <!-- Header -->
      <div class="ct-view__header">
        <div>
          <h1 class="ct-view__title">Component Types</h1>
          <p class="ct-view__subtitle">Manage the catalog of component types available for your inventory.</p>
        </div>
        <div class="ct-view__btn">
          <el-button
            variant="primary"
            label="New Component Type"
            icon="pi pi-plus"
            @click="openNew"
          />
        </div>
      </div>

      <!-- Main Content: 1-column layout -->
      <div class="ct-view__content">
        <component-type-table
          :componentTypes="componentTypeStore.componentTypes"
          :isLoading="componentTypeStore.isLoading"
          @edit="handleEdit"
          @delete="handleDelete"
          @activate="handleActivate"
          @deactivate="handleDeactivate"
        />
      </div>
    </div>

    <!-- Modal Form -->
    <component-type-modal
      v-model:visible="isModalVisible"
      :selectedComponentType="componentTypeStore.selectedComponentType"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.ct-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.ct-view__container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.ct-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem; /* Aumentado de 2rem a 4rem */
}

.ct-view__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.ct-view__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
}

.ct-view__btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.ct-view__btn :deep(.el-button) {
  padding: 0.5rem 1.25rem !important;
  font-size: 0.85rem !important;
}

.ct-view__btn :deep(.p-button-icon) {
  font-size: 0.75rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.ct-view__content {
  width: 100%;
}

@media (max-width: 640px) {
  .ct-view__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
}
</style>
