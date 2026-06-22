<script setup>
import { ref } from 'vue';
import { useServiceExecutionStore } from '../../../application/service-execution.store.js';

const props = defineProps({
    executionId: { type: String, required: true }
});

const store = useServiceExecutionStore();
const components = ref([{ componentTypeId: '', quantity: 1 }]);

function addRow() {
    components.value.push({ componentTypeId: '', quantity: 1 });
}

function removeRow(index) {
    components.value.splice(index, 1);
}

async function register() {
    // await store.registerComponents(props.executionId, { components: components.value });
}
</script>

<template>
  <div class="component-registration">
    <h4 class="component-registration__title">Components Used</h4>
    <div v-for="(comp, index) in components" :key="index" class="component-registration__row">
      <el-input-text v-model="comp.componentTypeId" placeholder="Component type" class="component-registration__input" />
      <el-input-text v-model="comp.quantity" type="number" placeholder="Qty" class="component-registration__qty" />
      <el-button icon="pi pi-trash" variant="text" severity="danger" @click="removeRow(index)" />
    </div>
    <div class="component-registration__actions">
      <el-button label="Add Component" icon="pi pi-plus" variant="text" @click="addRow" />
      <el-button label="Register Components" icon="pi pi-save" @click="register" />
    </div>
  </div>
</template>

<style scoped>
.component-registration__title { margin: 0 0 1rem; color: var(--el-primary); }
.component-registration__row { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
.component-registration__input { flex: 1; }
.component-registration__qty { width: 80px; }
.component-registration__actions { display: flex; justify-content: space-between; margin-top: 1rem; }
</style>
