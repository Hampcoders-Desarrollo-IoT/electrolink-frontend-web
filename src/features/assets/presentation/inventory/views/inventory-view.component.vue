<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTechnicianInventoryStore } from '../../../application/technician-inventory.store.js';
import { useComponentStore } from '../../../application/component.store.js';
import TechnicianInventoryDrawer from '../components/technician-inventory-drawer.component.vue';
import InventoryTable from '../components/inventory-table.component.vue';
import ElKpiCard from '@/shared/presentation/components/el-kpi-card.vue';

const inventoryStore = useTechnicianInventoryStore();
const componentStore = useComponentStore();
const route = useRoute();

const showDrawer = ref(false);

onMounted(async () => {
    const techId = route.params.technicianId;
    await Promise.all([
        inventoryStore.loadInventory(techId),
        inventoryStore.loadStockItems(techId),
        componentStore.loadComponents(techId)
    ]);
});

const displayItems = computed(() => {
    return inventoryStore.detailedStockItems.length > 0
        ? inventoryStore.detailedStockItems
        : inventoryStore.stockItems;
});

// KPI computed
const totalStock = computed(() =>
    inventoryStore.stockItems.reduce((sum, item) => sum + item.quantityAvailable, 0)
);
const lowStockCount = computed(() =>
    inventoryStore.stockItems.filter(item => item.isLowStock).length
);
const criticalStockCount = computed(() =>
    inventoryStore.stockItems.filter(item => item.isCriticalStock).length
);

// Owned component IDs (passed into drawer)
const ownedComponentIds = computed(() =>
    inventoryStore.stockItems.map(item => item.componentId)
);

async function handleAdjustmentSubmit(payload) {
    const techId = route.params.technicianId;
    const isNew = !ownedComponentIds.value.includes(payload.componentId);

    if (isNew && payload.type === 'INCREASE') {
        await inventoryStore.addStockItem(techId, {
            componentId: payload.componentId,
            quantity: payload.quantity,
            alertThreshold: payload.alertThreshold || 5
        });
    } else if (payload.type === 'INCREASE') {
        await inventoryStore.increaseStock(techId, payload.componentId, payload.quantity);
    } else if (payload.type === 'DECREASE') {
        await inventoryStore.decreaseStock(techId, payload.componentId, payload.quantity);
    }

    showDrawer.value = false;
    // Refresh data after mutation
    await Promise.all([
        inventoryStore.loadInventory(techId),
        inventoryStore.loadStockItems(techId)
    ]);
}

function exportCSV() {
    console.log('Export CSV triggered');
}

function handleAdjust(item) {
    showDrawer.value = true;
}
</script>

<template>
  <div class="inventory-view">
    <!-- Header -->
    <div class="inventory-view__header">
      <div>
        <h1 class="inventory-view__title">My Inventory</h1>
        <p class="inventory-view__subtitle">Monitor component stock levels and apply adjustments.</p>
      </div>
      <div class="inventory-view__actions">
        <el-button variant="secondary" icon="pi pi-download" label="Export" @click="exportCSV" />
        <el-button variant="primary" icon="pi pi-sliders-h" label="Adjust / Add Stock" @click="showDrawer = true" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="inventory-view__kpis">
      <el-kpi-card
        label="TOTAL ITEMS"
        :value="inventoryStore.stockItems.length"
        icon="pi pi-box"
        iconClass="kpi-card__icon--primary"
      />

      <el-kpi-card
        label="TOTAL UNITS"
        :value="totalStock.toLocaleString()"
        icon="pi pi-database"
        iconClass="kpi-card__icon--info"
      />

      <el-kpi-card
        label="LOW STOCK"
        :value="lowStockCount + ' Items'"
        icon="pi pi-exclamation-triangle"
        iconClass="kpi-card__icon--warning"
      />

      <el-kpi-card
        label="CRITICAL"
        :value="criticalStockCount + ' Items'"
        icon="pi pi-times-circle"
        iconClass="kpi-card__icon--danger"
      />
    </div>

    <!-- Table -->
    <div class="inventory-view__table-container">
      <inventory-table
        :items="displayItems"
        :isLoading="inventoryStore.isLoading"
        @adjust="handleAdjust"
      />
    </div>

    <!-- Adjustment Drawer -->
    <technician-inventory-drawer
      v-model:visible="showDrawer"
      :technicianId="route.params.technicianId"
      @submit="handleAdjustmentSubmit"
    />
  </div>
</template>

<style scoped>
.inventory-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.inventory-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.inventory-view__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.inventory-view__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
}

.inventory-view__actions {
  display: flex;
  gap: 0.75rem;
}

/* KPI Cards */
.inventory-view__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.kpi-card__icon--danger {
  background-color: rgba(239, 68, 68, 0.1);
  color: var(--el-danger);
}

/* Table Container */
.inventory-view__table-container {
  width: 100%;
}

@media (max-width: 768px) {
  .inventory-view__kpis {
    grid-template-columns: repeat(2, 1fr);
  }

  .inventory-view__header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
