<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useComponentStore } from '../../../application/component.store.js';
import { useComponentTypeStore } from '../../../application/component-type.store.js';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ComponentCatalogTable from '../components/component-catalog-table.component.vue';
import ComponentCatalogModal from '../components/component-catalog-modal.component.vue';
import ComponentCatalogKpis from '../components/component-catalog-kpis.component.vue';

const route = useRoute();
const componentStore = useComponentStore();
const componentTypeStore = useComponentTypeStore();
const confirm = useConfirm();
const toast = useToast();

const isModalVisible = ref(false);
const technicianId = () => route.params.technicianId;

onMounted(() => {
    componentStore.loadComponents(technicianId());
    componentTypeStore.loadComponentTypes(technicianId());
});

// KPI computeds
const totalComponents = computed(() => componentStore.components.length);
const activeComponents = computed(() => componentStore.components.filter(c => c.isActive).length);
const inactiveComponents = computed(() => componentStore.components.filter(c => !c.isActive).length);
const totalTypes = computed(() => componentTypeStore.componentTypes.length);

function openNew() {
    componentStore.selectComponent(null);
    isModalVisible.value = true;
}

async function handleSave(formData) {
    const id = technicianId();
    if (componentStore.selectedComponent) {
        const updated = await componentStore.updateComponent(id, componentStore.selectedComponent.id, formData);
        if (updated) {
            toast.add({ severity: 'success', summary: 'Updated', detail: `"${updated.name}" updated successfully.`, life: 3000 });
            closeModal();
        }
    } else {
        const created = await componentStore.createComponent(id, formData);
        if (created) {
            toast.add({ severity: 'success', summary: 'Created', detail: `"${created.name}" created successfully.`, life: 3000 });
            closeModal();
        }
    }
}

function closeModal() {
    isModalVisible.value = false;
    componentStore.selectComponent(null);
}

function handleEdit(item) {
    componentStore.selectComponent(item);
    isModalVisible.value = true;
}

function handleDelete(item) {
    confirm.require({
        message: `Are you sure you want to delete "${item.name}"?`,
        header: 'Delete Component',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-text',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await componentStore.deleteComponent(technicianId(), item.id);
            toast.add({ severity: 'info', summary: 'Deleted', detail: `"${item.name}" has been deleted.`, life: 3000 });
        }
    });
}

async function handleActivate(item) {
    // TODO: implement activate when API is ready
    toast.add({ severity: 'success', summary: 'Activated', detail: `"${item.name}" is now active.`, life: 3000 });
}

async function handleDeactivate(item) {
    // TODO: implement deactivate when API is ready
    toast.add({ severity: 'warn', summary: 'Deactivated', detail: `"${item.name}" has been deactivated.`, life: 3000 });
}
</script>

<template>
  <div class="cc-view">
    <div class="cc-view__container">
      <!-- Header -->
      <div class="cc-view__header">
        <div>
          <h1 class="cc-view__title">Component Catalog</h1>
          <p class="cc-view__subtitle">Manage the catalog of components available for your inventory.</p>
        </div>
        <div class="cc-view__btn">
          <el-button
            variant="primary"
            label="New Component"
            icon="pi pi-plus"
            @click="openNew"
          />
        </div>
      </div>

      <!-- KPI Cards -->
      <component-catalog-kpis
        :totalComponents="totalComponents"
        :activeComponents="activeComponents"
        :inactiveComponents="inactiveComponents"
        :totalTypes="totalTypes"
        class="cc-view__kpis"
      />

      <!-- Table -->
      <div class="cc-view__content">
        <component-catalog-table
          :components="componentStore.components"
          :isLoading="componentStore.isLoading"
          :componentTypes="componentTypeStore.componentTypes"
          @edit="handleEdit"
          @delete="handleDelete"
          @activate="handleActivate"
          @deactivate="handleDeactivate"
        />
      </div>
    </div>

    <!-- Modal -->
    <component-catalog-modal
      v-model:visible="isModalVisible"
      :selectedComponent="componentStore.selectedComponent"
      :componentTypes="componentTypeStore.componentTypes"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.cc-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.cc-view__container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.cc-view__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cc-view__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.cc-view__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
}

.cc-view__btn {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.cc-view__btn :deep(.el-button) {
  padding: 0.5rem 1.25rem !important;
  font-size: 0.85rem !important;
}

.cc-view__btn :deep(.p-button-icon) {
  font-size: 0.75rem !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.cc-view__kpis {
  margin-bottom: 2rem;
}

.cc-view__content {
  width: 100%;
}

@media (max-width: 768px) {
  .cc-view__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
}
</style>
