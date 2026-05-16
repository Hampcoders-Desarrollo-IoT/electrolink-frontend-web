<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    items: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['adjust']);

const globalFilter = ref('');

const filteredItems = computed(() => {
    if (!globalFilter.value) return props.items;
    const filter = globalFilter.value.toLowerCase();
    return props.items.filter(item =>
        (item.componentName || '').toLowerCase().includes(filter) ||
        (item.componentId || '').toLowerCase().includes(filter)
    );
});
</script>

<template>
  <el-table-card
    :items="filteredItems"
    :loading="isLoading"
    v-model:filter="globalFilter"
    searchPlaceholder="Search by component name..."
    totalLabel="items"
    emptyMessage="No inventory items found"
    emptyHint="Add stock using the button above"
  >
    <template #columns>
      <pv-column field="componentName" header="COMPONENT" sortable style="min-width: 16rem">
        <template #body="{ data }">
          <div class="inv-cell-component">
            <div class="inv-cell-icon-wrap">
              <i class="pi pi-bolt"></i>
            </div>
            <div>
              <div class="inv-cell-title">{{ data.componentName || 'Unknown' }}</div>
              <div class="inv-cell-id">{{ data.componentId }}</div>
            </div>
          </div>
        </template>
      </pv-column>

      <pv-column field="quantityAvailable" header="STOCK" sortable style="min-width: 8rem">
        <template #body="{ data }">
          <div class="inv-cell-stock">
            <span :class="['inv-stock-value', {
              'inv-stock-value--low': data.isLowStock,
              'inv-stock-value--critical': data.isCriticalStock
            }]">
              {{ data.stock }} units
            </span>
            <span v-if="data.isLowStock && !data.isCriticalStock" class="inv-badge inv-badge--warn">LOW</span>
            <span v-if="data.isCriticalStock" class="inv-badge inv-badge--danger">CRITICAL</span>
          </div>
        </template>
      </pv-column>

      <pv-column field="alertThreshold" header="ALERT AT" sortable style="min-width: 8rem">
        <template #body="{ data }">
          <span class="inv-cell-threshold">{{ data.alertThreshold }} units</span>
        </template>
      </pv-column>

      <pv-column field="lastUpdated" header="LAST UPDATED" sortable style="min-width: 10rem">
        <template #body="{ data }">
          <span class="inv-cell-date">
            {{ data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' }}
          </span>
        </template>
      </pv-column>

      <pv-column header="ACTIONS" style="min-width: 8rem">
        <template #body="{ data }">
          <div class="inv-actions">
            <pv-button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-sm"
              v-tooltip.top="'Adjust'"
              @click="emit('adjust', data)"
            />
          </div>
        </template>
      </pv-column>
    </template>
  </el-table-card>
</template>

<style scoped>
.inv-cell-component {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.inv-cell-icon-wrap {
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

.inv-cell-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
}

.inv-cell-id {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: monospace;
  margin-top: 0.125rem;
}

.inv-cell-stock {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.inv-stock-value {
  font-weight: 600;
  color: #111827;
}

.inv-stock-value--low {
  color: #d97706;
}

.inv-stock-value--critical {
  color: var(--el-danger);
}

.inv-cell-threshold {
  color: #6b7280;
  font-weight: 500;
  font-size: 0.875rem;
}

.inv-cell-date {
  font-size: 0.85rem;
  color: #6b7280;
}

.inv-actions {
  display: flex;
  gap: 0.25rem;
}

.inv-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border-width: 1px;
}

.inv-badge--warn {
  background-color: #fef3c7;
  color: #d97706;
  border-color: #fde68a;
}

.inv-badge--danger {
  background-color: #fee2e2;
  color: #ef4444;
  border-color: #fecaca;
}
</style>
