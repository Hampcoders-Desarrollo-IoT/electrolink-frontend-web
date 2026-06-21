<script setup>
import { computed } from 'vue';
import { useTechnicianInventoryStore } from '../../../application/technician-inventory.store.js';

const inventoryStore = useTechnicianInventoryStore();

// Use detailedStockItems (from GET /inventory/stock-items) which includes componentName
const historyData = computed(() => {
    const items = inventoryStore.detailedStockItems.length > 0
        ? inventoryStore.detailedStockItems
        : inventoryStore.stockItems;

    return items.map(item => ({
        id: item.id,
        componentName: item.componentName || 'Unknown',
        componentId: item.componentId,
        type: 'CURRENT STOCK',
        quantity: item.quantityAvailable,
        alertThreshold: item.alertThreshold,
        reason: 'Current Available Stock',
        date: item.lastUpdated
            ? new Date(item.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) +
              ', ' + new Date(item.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
            : 'N/A'
    }));
});
</script>

<template>
  <div class="ti-history-wrapper">
    <!-- Table Card -->
    <section class="ti-history-card">
      <div class="ti-history-card__header">
        <h2 class="ti-history-card__title">Current Inventory Status</h2>
        <div class="ti-history-card__pulse">
          <div class="ti-pulse-dot"></div>
          Live Updates
        </div>
      </div>

      <div class="ti-table-container">
        <table class="ti-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Alert At</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in historyData" :key="item.id">
              <td>
                <div class="ti-cell-name">{{ item.componentName }}</div>
                <div class="ti-cell-id">ID: {{ item.componentId }}</div>
              </td>
              <td>
                <span class="ti-badge ti-badge--neutral">
                  <i class="pi pi-box"></i>
                  STOCK
                </span>
              </td>
              <td>
                 <span class="ti-cell-quantity">
                  {{ item.quantity }}
                </span>
              </td>
              <td>
                <span class="ti-cell-threshold">
                  {{ item.alertThreshold }}
                </span>
              </td>
              <td>
                <div class="ti-cell-date">{{ item.date }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="ti-history-card__footer">
        <span>Showing {{ historyData.length }} items</span>
        <div class="ti-pagination">
           <button disabled><i class="pi pi-angle-left"></i></button>
           <button disabled><i class="pi pi-angle-right"></i></button>
        </div>
      </div>
    </section>

    <!-- Info Banner -->
    <section class="ti-info-banner">
      <div class="ti-info-banner__icon">
        <i class="pi pi-info-circle"></i>
      </div>
      <div class="ti-info-banner__content">
        <h3>Note for Technicians</h3>
        <p>
          Manual adjustments are logged for inventory reconciliation. All changes are tagged 
          with your profile and timestamp. Significant decreases (>25% stock) require supervisor 
          approval before final processing.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ti-history-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ti-history-card {
  background-color: var(--surface-card);
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ti-history-card__header {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ti-history-card__title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: var(--el-primary);
}

.ti-history-card__pulse {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--el-warm-gray);
}

.ti-pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: var(--el-brand);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.ti-table-container {
  overflow-x: auto;
}

.ti-table {
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
  white-space: nowrap;
  border-collapse: collapse;
}

.ti-table th {
  padding: 1rem 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--el-warm-gray);
  background-color: rgba(249, 250, 251, 0.5);
  border-bottom: 1px solid #e5e7eb;
}

.ti-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.ti-table tbody tr {
  transition: background-color 0.2s;
}

.ti-table tbody tr:hover {
  background-color: #f9fafb;
}

.ti-cell-name {
  font-weight: 600;
  color: var(--el-primary);
}

.ti-cell-id {
  font-size: 0.75rem;
  color: var(--el-warm-gray);
  margin-top: 0.125rem;
}

.ti-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid;
}

.ti-badge--neutral {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #e5e7eb;
}

.ti-cell-quantity {
  font-weight: 700;
  font-size: 1rem;
}

.ti-cell-threshold {
  color: #d97706;
  font-weight: 600;
}

.ti-cell-date {
  font-size: 0.75rem;
  color: var(--el-warm-gray);
}

.ti-history-card__footer {
  padding: 1rem 1.5rem;
  background-color: rgba(249, 250, 251, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--el-warm-gray);
}

.ti-pagination {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ti-pagination button {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #d1d5db;
  background-color: white;
  color: var(--el-warm-gray);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ti-pagination button:hover:not(:disabled) {
  background-color: #f9fafb;
}

.ti-pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info Banner */
.ti-info-banner {
  background-color: #fef9c3;
  border-left: 4px solid #facc15;
  border-radius: 0 0.75rem 0.75rem 0;
  padding: 1.25rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.ti-info-banner__icon {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: #fef08a;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ca8a04;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.ti-info-banner__icon i {
  font-size: 1.125rem;
  font-weight: 700;
}

.ti-info-banner__content h3 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #713f12;
  margin: 0 0 0.25rem 0;
}

.ti-info-banner__content p {
  font-size: 0.875rem;
  color: #854d0e;
  line-height: 1.625;
  margin: 0;
}
</style>
