<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTechnicianInventoryStore } from '../../../application/technician-inventory.store.js';
import { useComponentStore } from '../../../application/component.store.js';
import { useComponentTypeStore } from '../../../application/component-type.store.js';
import TechnicianInventoryDrawer from '../components/technician-inventory-drawer.component.vue';
import ElKpiCard from '@/shared/presentation/components/el-kpi-card.vue';

const inventoryStore = useTechnicianInventoryStore();
const componentStore = useComponentStore();
const componentTypeStore = useComponentTypeStore();
const route = useRoute();

const globalFilter = ref('');
const showDrawer = ref(false);

onMounted(async () => {
    const techId = route.params.technicianId;
    await Promise.all([
        inventoryStore.loadInventory(techId),
        inventoryStore.loadStockItems(techId),
        componentStore.loadComponents(techId),
        componentTypeStore.loadComponentTypes(techId)
    ]);
});

const filteredInventory = computed(() => {
    const items = inventoryStore.detailedStockItems.length > 0
        ? inventoryStore.detailedStockItems
        : inventoryStore.stockItems;
    if (!globalFilter.value) return items;
    const filter = globalFilter.value.toLowerCase();
    return items.filter(item =>
        (item.componentName || '').toLowerCase().includes(filter) ||
        (item.componentId || '').toLowerCase().includes(filter)
    );
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
            componentTypeId: payload.componentTypeId,
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

    <!-- Search & Table -->
    <div class="inventory-view__table-container">
      <pv-data-table
        :value="filteredInventory"
        :loading="inventoryStore.isLoading"
        paginator
        :rows="10"
        dataKey="id"
        responsiveLayout="scroll"
        class="inventory-table"
        :rowsPerPageOptions="[5, 10, 25]"
        stripedRows
      >
        <template #header>
          <div class="inventory-table__header">
            <el-input-text
              v-model="globalFilter"
              placeholder="Search by component name..."
              icon="pi pi-search"
            />
          </div>
        </template>

        <pv-column field="componentName" header="COMPONENT" sortable style="min-width: 16rem">
          <template #body="{ data }">
            <div class="inventory-table__component">
              <div class="inventory-table__component-icon-wrap">
                <i class="pi pi-bolt"></i>
              </div>
              <div>
                <span class="inventory-table__component-name">{{ data.componentName || 'Unknown' }}</span>
                <span class="inventory-table__component-id">{{ data.componentId }}</span>
              </div>
            </div>
          </template>
        </pv-column>

        <pv-column field="quantityAvailable" header="STOCK" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <div class="inventory-table__stock">
              <span :class="['inventory-table__stock-value', {
                'inventory-table__stock-value--low': data.isLowStock,
                'inventory-table__stock-value--critical': data.isCriticalStock
              }]">
                {{ data.stock }} units
              </span>
              <pv-tag v-if="data.isLowStock && !data.isCriticalStock" value="LOW" severity="warn" class="inventory-table__stock-badge" />
              <pv-tag v-if="data.isCriticalStock" value="CRITICAL" severity="danger" class="inventory-table__stock-badge" />
            </div>
          </template>
        </pv-column>

        <pv-column field="alertThreshold" header="ALERT AT" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <span class="inventory-table__threshold">{{ data.alertThreshold }} units</span>
          </template>
        </pv-column>

        <pv-column field="lastUpdated" header="LAST UPDATED" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="inventory-table__date">
              {{ data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}
            </span>
          </template>
        </pv-column>

        <pv-column header="ACTIONS" style="min-width: 8rem">
          <template #body="{ data }">
            <el-button
              variant="ghost"
              label="Adjust"
              icon="pi pi-pencil"
              @click="showDrawer = true"
            />
          </template>
        </pv-column>
      </pv-data-table>
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

/* Table */
.inventory-view__table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.inventory-table__header {
  max-width: 400px;
}

.inventory-table__component {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.inventory-table__component-icon-wrap {
  width: 2rem;
  height: 2rem;
  background-color: rgba(109, 158, 235, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-celeste);
  font-size: 0.875rem;
  flex-shrink: 0;
}

.inventory-table__component-name {
  display: block;
  font-weight: 600;
  color: var(--el-primary);
  font-size: 0.9rem;
}

.inventory-table__component-id {
  display: block;
  font-size: 0.72rem;
  color: var(--el-warm-gray);
  font-family: monospace;
  margin-top: 0.125rem;
}

.inventory-table__stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inventory-table__stock-value {
  font-weight: 600;
}

.inventory-table__stock-value--low {
  color: #d97706;
}

.inventory-table__stock-value--critical {
  color: var(--el-danger);
}

.inventory-table__threshold {
  color: #d97706;
  font-weight: 500;
  font-size: 0.875rem;
}

.inventory-table__date {
  font-size: 0.85rem;
  color: var(--el-warm-gray);
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
