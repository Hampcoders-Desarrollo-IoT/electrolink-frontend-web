<script setup>
import { ref, computed, onMounted } from 'vue';
import { useInventoryStore } from '../../../application/inventory.store.js';
import AddStockDialog from '../components/add-stock-dialog.component.vue';

const inventoryStore = useInventoryStore();

const globalFilter = ref('');
const showAddStockDialog = ref(false);

onMounted(() => {
    inventoryStore.loadInventory();
});

const filteredInventory = computed(() => {
    if (!globalFilter.value) return inventoryStore.inventory;
    const filter = globalFilter.value.toLowerCase();
    return inventoryStore.inventory.filter(item =>
        item.name.toLowerCase().includes(filter) ||
        item.category.toLowerCase().includes(filter) ||
        item.sku.toLowerCase().includes(filter)
    );
});

function getStockSeverity(item) {
    if (item.isCriticalStock) return 'danger';
    if (item.isLowStock) return 'warn';
    return null;
}

function formatCurrency(value) {
    return `$${Number(value).toFixed(2)}`;
}

function onAddStockConfirm(command) {
    inventoryStore.addStock(command);
    showAddStockDialog.value = false;
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
        <h1 class="inventory-view__title">Component Inventory</h1>
        <p class="inventory-view__subtitle">Manage technical stock, monitor levels, and order replacements.</p>
      </div>
      <div class="inventory-view__actions">
        <el-button variant="secondary" icon="pi pi-download" label="Export" @click="exportCSV" />
        <el-button variant="primary" icon="pi pi-plus" label="Add Stock" @click="showAddStockDialog = true" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="inventory-view__kpis">
      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <i class="pi pi-box kpi-card__icon kpi-card__icon--primary"></i>
            <div>
              <p class="kpi-card__label">TOTAL ITEMS</p>
              <p class="kpi-card__value">{{ inventoryStore.totalItemsCount.toLocaleString() }}</p>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <i class="pi pi-exclamation-triangle kpi-card__icon kpi-card__icon--warning"></i>
            <div>
              <p class="kpi-card__label">LOW STOCK</p>
              <p class="kpi-card__value">{{ inventoryStore.lowStockItems.length }} Items</p>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <i class="pi pi-th-large kpi-card__icon kpi-card__icon--info"></i>
            <div>
              <p class="kpi-card__label">CATEGORIES</p>
              <p class="kpi-card__value">{{ inventoryStore.categoriesCount }} Groups</p>
            </div>
          </div>
        </template>
      </pv-card>

      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <i class="pi pi-dollar kpi-card__icon kpi-card__icon--success"></i>
            <div>
              <p class="kpi-card__label">INVENTORY VALUE</p>
              <p class="kpi-card__value">{{ formatCurrency(inventoryStore.totalInventoryValue) }}</p>
            </div>
          </div>
        </template>
      </pv-card>
    </div>

    <!-- Search & Table -->
    <div class="inventory-view__table-container">
      <pv-data-table
        :value="filteredInventory"
        :loading="inventoryStore.isLoading"
        paginator
        :rows="5"
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
              placeholder="Search component name, category or SKU..."
              icon="pi pi-search"
            />
          </div>
        </template>

        <pv-column field="name" header="COMPONENT" sortable style="min-width: 14rem">
          <template #body="{ data }">
            <div class="inventory-table__component">
              <i class="pi pi-bolt inventory-table__component-icon"></i>
              <div>
                <span class="inventory-table__component-name">{{ data.name }}</span>
                <span class="inventory-table__component-sku">SKU: {{ data.sku }}</span>
              </div>
            </div>
          </template>
        </pv-column>

        <pv-column field="category" header="CATEGORY" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <pv-tag :value="data.category" severity="info" />
          </template>
        </pv-column>

        <pv-column field="stock" header="STOCK" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <div class="inventory-table__stock">
              <span :class="['inventory-table__stock-value', { 'inventory-table__stock-value--low': data.isLowStock, 'inventory-table__stock-value--critical': data.isCriticalStock }]">
                {{ data.stock }} {{ data.unit }}
              </span>
              <pv-tag v-if="data.isLowStock" value="LOW" severity="warn" class="inventory-table__stock-badge" />
              <pv-tag v-if="data.isCriticalStock" value="CRITICAL" severity="danger" class="inventory-table__stock-badge" />
            </div>
          </template>
        </pv-column>

        <pv-column field="minStock" header="MIN STOCK" sortable style="min-width: 6rem">
          <template #body="{ data }">
            {{ data.minStock }} {{ data.unit }}
          </template>
        </pv-column>

        <pv-column field="unitCost" header="UNIT COST" sortable style="min-width: 6rem">
          <template #body="{ data }">
            {{ formatCurrency(data.unitCost) }}
          </template>
        </pv-column>

        <pv-column header="ACTIONS" style="min-width: 6rem">
          <template #body="{ data }">
            <el-button
              v-if="data.isLowStock || data.isCriticalStock"
              variant="ghost"
              label="Reorder"
              @click="showAddStockDialog = true"
            />
          </template>
        </pv-column>
      </pv-data-table>
    </div>

    <!-- Add Stock Dialog -->
    <add-stock-dialog
      :visible="showAddStockDialog"
      :components="inventoryStore.inventory"
      @confirm="onAddStockConfirm"
      @cancel="showAddStockDialog = false"
    />
  </div>
</template>

<style scoped>
.inventory-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.inventory-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
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

.inventory-view__kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-card__icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.kpi-card__icon--primary {
  background-color: rgba(46, 58, 89, 0.1);
  color: var(--el-primary);
}

.kpi-card__icon--warning {
  background-color: rgba(255, 228, 146, 0.3);
  color: #d97706;
}

.kpi-card__icon--info {
  background-color: rgba(181, 213, 245, 0.3);
  color: #2563eb;
}

.kpi-card__icon--success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--el-success);
}

.kpi-card__label {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--el-warm-gray);
  letter-spacing: 0.05em;
  margin: 0;
}

.kpi-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0.25rem 0 0;
}

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

.inventory-table__component-icon {
  color: var(--el-celeste);
  font-size: 1.1rem;
}

.inventory-table__component-name {
  display: block;
  font-weight: 600;
  color: var(--el-primary);
}

.inventory-table__component-sku {
  display: block;
  font-size: 0.75rem;
  color: var(--el-warm-gray);
}

.inventory-table__stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inventory-table__stock-value--low {
  color: #d97706;
  font-weight: 600;
}

.inventory-table__stock-value--critical {
  color: var(--el-danger);
  font-weight: 700;
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
