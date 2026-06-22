<script setup>
import { ref, onMounted } from 'vue';
import { usePropertyStore } from '../../../assets/application/property.store.js';

const emit = defineEmits(['complete', 'back']);

const store = usePropertyStore();
const properties = ref([]);
const selectedPropertyId = ref('');

onMounted(async () => {
    await store.loadProperties('me');
    properties.value = store.properties;
});

function selectProperty(property) {
    selectedPropertyId.value = property.id;
    emit('complete', { propertyId: property.id });
}
</script>

<template>
  <div class="step-property">
    <h3 class="step-property__title">Select a Property</h3>
    <p class="step-property__subtitle">Choose the property where the service will be performed</p>
    <div class="step-property__grid">
      <div
        v-for="property in properties"
        :key="property.id"
        :class="['step-property__card', { 'step-property__card--selected': selectedPropertyId === property.id }]"
        @click="selectProperty(property)"
      >
        <i class="pi pi-home step-property__card-icon"></i>
        <div class="step-property__card-info">
          <strong>{{ property.address?.street ?? 'Unknown' }}</strong>
          <span>{{ property.address?.city ?? '' }}</span>
        </div>
        <pv-tag v-if="selectedPropertyId === property.id" value="Selected" severity="success" />
      </div>
    </div>
    <div class="step-property__actions">
      <el-button label="Back" icon="pi pi-chevron-left" variant="text" @click="emit('back')" />
    </div>
  </div>
</template>

<style scoped>
.step-property__title { margin: 0 0 0.25rem; color: var(--el-primary); }
.step-property__subtitle { margin: 0 0 1.5rem; color: var(--el-warm-gray); font-size: 0.9rem; }
.step-property__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.step-property__card {
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px; cursor: pointer; transition: all 0.2s;
}
.step-property__card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); }
.step-property__card--selected { border-color: var(--el-primary); }
.step-property__card-icon { font-size: 1.5rem; color: var(--el-primary); }
.step-property__card-info { display: flex; flex-direction: column; flex: 1; }
.step-property__card-info strong { font-size: 0.95rem; color: var(--el-primary); }
.step-property__card-info span { font-size: 0.8rem; color: var(--el-warm-gray); }
.step-property__actions { margin-top: 2rem; display: flex; gap: 1rem; }
</style>
