<script setup>
import { ref, computed, onMounted } from 'vue';
import { usePropertiesStore } from '../../../application/properties.store.js';
import { useRouter } from 'vue-router';
import PropertyCard from '../components/property-card.component.vue';

const propertiesStore = usePropertiesStore();
const router = useRouter();

const activeFilter = ref('All');
const filters = ['All', 'Occupied', 'Maintenance', 'Vacant'];

onMounted(() => {
    propertiesStore.loadProperties();
});

const filteredProperties = computed(() => {
    if (activeFilter.value === 'All') return propertiesStore.properties;
    return propertiesStore.properties.filter(p => p.status === activeFilter.value);
});

const filterCounts = computed(() => ({
    All: propertiesStore.totalProperties,
    Occupied: propertiesStore.occupiedProperties,
    Maintenance: propertiesStore.maintenanceProperties,
    Vacant: propertiesStore.vacantProperties
}));

const mapMarkers = computed(() =>
    propertiesStore.properties.map(p => ({
        lat: p.latitude,
        lng: p.longitude,
        popup: p.name,
        type: 'property'
    }))
);

function onPropertyClick(property) {
    propertiesStore.selectProperty(property);
}

function goToAddProperty() {
    router.push({ name: 'assets-property-new' });
}
</script>

<template>
  <div class="properties-view">
    <!-- Left Panel: Property List -->
    <aside class="properties-view__panel">
      <div class="properties-view__panel-header">
        <div class="properties-view__panel-title-row">
          <h1 class="properties-view__title">Property Portfolio</h1>
          <el-button variant="primary" icon="pi pi-plus" label="Add Property" @click="goToAddProperty" />
        </div>

        <!-- Filter Chips -->
        <div class="properties-view__filters">
          <button
            v-for="filter in filters"
            :key="filter"
            :class="['properties-view__filter-chip', { 'properties-view__filter-chip--active': activeFilter === filter }]"
            @click="activeFilter = filter"
          >
            {{ filter }} ({{ filterCounts[filter] }})
          </button>
        </div>
      </div>

      <!-- Scrollable List -->
      <div class="properties-view__list">
        <property-card
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          :selected="propertiesStore.selectedProperty?.id === property.id"
          @click="onPropertyClick"
        />

        <p v-if="filteredProperties.length === 0 && !propertiesStore.isLoading" class="properties-view__empty">
          No properties found for this filter.
        </p>
      </div>
    </aside>

    <!-- Right Panel: Map -->
    <section class="properties-view__map-panel">
      <!-- Map UI Overlays -->
      <div class="properties-view__map-controls-left">
        <div class="properties-view__map-control-group">
          <button class="properties-view__map-btn properties-view__map-btn--active">
            <i class="pi pi-map"></i>
          </button>
          <button class="properties-view__map-btn">
            <i class="pi pi-th-large"></i>
          </button>
        </div>
      </div>

      <div class="properties-view__map-controls-right">
        <div class="properties-view__map-zoom">
          <button class="properties-view__map-btn"><i class="pi pi-plus"></i></button>
          <button class="properties-view__map-btn"><i class="pi pi-minus"></i></button>
        </div>
      </div>

      <!-- Map Placeholder -->
      <div class="properties-view__map-container" id="properties-map">
        <div class="properties-view__map-placeholder">
          <i class="pi pi-map" style="font-size: 3rem; color: var(--el-warm-gray);"></i>
          <p style="color: var(--el-warm-gray); margin-top: 1rem;">Map loads here (Leaflet integration)</p>
        </div>
      </div>

      <!-- Floating Legend -->
      <div class="properties-view__legend">
        <h4 class="properties-view__legend-title">RESOURCE STATUS</h4>
        <div class="properties-view__legend-items">
          <div class="properties-view__legend-item">
            <span class="properties-view__legend-dot properties-view__legend-dot--green"></span>
            <span class="properties-view__legend-label">Active Monitoring</span>
            <span class="properties-view__legend-value">85%</span>
          </div>
          <div class="properties-view__legend-item">
            <span class="properties-view__legend-dot properties-view__legend-dot--amber"></span>
            <span class="properties-view__legend-label">Maintenance Window</span>
            <span class="properties-view__legend-value">12%</span>
          </div>
          <div class="properties-view__legend-item">
            <span class="properties-view__legend-dot properties-view__legend-dot--red"></span>
            <span class="properties-view__legend-label">System Outage</span>
            <span class="properties-view__legend-value">3%</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.properties-view {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.properties-view__panel {
  width: 500px;
  flex-shrink: 0;
  border-right: 1px solid rgba(169, 177, 186, 0.2);
  background: white;
  display: flex;
  flex-direction: column;
}

.properties-view__panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(169, 177, 186, 0.1);
}

.properties-view__panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.properties-view__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.properties-view__filters {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.properties-view__filter-chip {
  padding: 0.375rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background: var(--el-bg-soft);
  color: var(--el-warm-gray);
}

.properties-view__filter-chip--active {
  background: var(--el-primary);
  color: white;
}

.properties-view__filter-chip:hover:not(.properties-view__filter-chip--active) {
  background: rgba(169, 177, 186, 0.3);
}

.properties-view__list {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: rgba(232, 238, 247, 0.15);
}

.properties-view__empty {
  text-align: center;
  color: var(--el-warm-gray);
  padding: 2rem;
}

.properties-view__map-panel {
  flex: 1;
  position: relative;
  background: var(--el-bg-soft);
}

.properties-view__map-controls-left {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 10;
}

.properties-view__map-control-group {
  background: white;
  border-radius: 12px;
  padding: 0.25rem;
  display: flex;
  gap: 0.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(169, 177, 186, 0.2);
}

.properties-view__map-controls-right {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
}

.properties-view__map-zoom {
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(169, 177, 186, 0.2);
  overflow: hidden;
}

.properties-view__map-btn {
  padding: 0.75rem;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  color: var(--el-primary);
}

.properties-view__map-btn:hover {
  background: var(--el-bg-soft);
}

.properties-view__map-btn--active {
  background: var(--el-primary);
  color: white;
  border-radius: 8px;
}

.properties-view__map-container {
  width: 100%;
  height: 100%;
}

.properties-view__map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 50%, var(--el-bg-soft) 0%, #cbd5e1 100%);
}

.properties-view__legend {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 10;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  padding: 1rem 1.25rem;
  border-radius: 12px;
  border: 1px solid rgba(169, 177, 186, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  max-width: 240px;
}

.properties-view__legend-title {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: var(--el-warm-gray);
  margin: 0 0 0.75rem;
}

.properties-view__legend-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.properties-view__legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.properties-view__legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.properties-view__legend-dot--green { background: var(--el-success); }
.properties-view__legend-dot--amber { background: #f59e0b; }
.properties-view__legend-dot--red { background: var(--el-danger); }

.properties-view__legend-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--el-primary);
  flex: 1;
}

.properties-view__legend-value {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--el-primary);
}

@media (max-width: 768px) {
  .properties-view {
    flex-direction: column;
  }

  .properties-view__panel {
    width: 100%;
    height: 50vh;
  }

  .properties-view__map-panel {
    height: 50vh;
  }
}
</style>
