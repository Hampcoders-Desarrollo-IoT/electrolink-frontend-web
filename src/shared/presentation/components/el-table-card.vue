<script setup>
import { computed } from 'vue';

const props = defineProps({
  items: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  filter: { type: String, default: '' },
  searchPlaceholder: { type: String, default: 'Search...' },
  searchable: { type: Boolean, default: true },
  totalLabel: { type: String, default: 'items' },
  emptyMessage: { type: String, default: 'No items found' },
  emptyHint: { type: String, default: '' },
  rows: { type: Number, default: 10 },
  dataKey: { type: String, default: 'id' }
});

const emit = defineEmits(['update:filter']);

function onFilterInput(val) {
  emit('update:filter', val);
}
</script>

<template>
  <section class="el-table-card">
    <!-- Card Header -->
    <div class="el-table-card__header">
      <div v-if="searchable" class="el-table-card__search-wrapper">
        <el-input-text
          :modelValue="filter"
          @update:modelValue="onFilterInput"
          :placeholder="searchPlaceholder"
          icon="pi pi-search"
          class="el-table-card__search-input"
        />
      </div>
      <div class="el-table-card__header-right">
        <slot name="header-actions">
          <div class="el-table-card__status-indicator">
            <div class="el-table-card__pulse"></div>
            Live Updates
          </div>
        </slot>
      </div>
    </div>

    <!-- Table Container -->
    <div class="el-table-card__container">
      <pv-data-table
        :value="items"
        :loading="loading"
        :rows="rows"
        :dataKey="dataKey"
        responsiveLayout="scroll"
        class="el-data-table"
      >
        <template #empty>
          <slot name="empty">
            <div class="el-table-card__empty">
              <i class="pi pi-inbox"></i>
              <p>{{ emptyMessage }}</p>
              <p v-if="emptyHint" class="el-table-card__empty-hint">{{ emptyHint }}</p>
            </div>
          </slot>
        </template>

        <!-- Column slot — consumers define their pv-columns here -->
        <slot name="columns" :items="items" :filter="filter"></slot>
      </pv-data-table>
    </div>

    <!-- Pagination Footer -->
    <div class="el-table-card__footer">
      <span class="el-table-card__footer-info">
        Showing {{ items.length }} of {{ items.length }} {{ totalLabel }}
      </span>
      <div class="el-table-card__footer-nav">
        <slot name="footer-actions">
          <button class="el-table-card__nav-btn" disabled>
            <i class="pi pi-caret-left"></i>
          </button>
          <button class="el-table-card__nav-btn">
            <i class="pi pi-caret-right"></i>
          </button>
        </slot>
      </div>
    </div>
  </section>
</template>

<style scoped>
.el-table-card {
  background: white;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.el-table-card__header {
  padding: 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(249, 250, 251, 0.5);
}

.el-table-card__search-wrapper {
  flex-grow: 1;
  max-width: 400px;
}

.el-table-card__header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.el-table-card__status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.el-table-card__pulse {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #f97316;
  animation: el-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes el-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .5; }
}

.el-table-card__container {
  overflow-x: auto;
}

/* DataTable overrides */
:deep(.el-data-table .p-datatable-header) {
  display: none;
}

:deep(.el-data-table.p-datatable) {
  border: none;
}

:deep(.el-data-table .p-datatable-thead > tr > th) {
  background-color: rgba(249, 250, 251, 0.5);
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-data-table .p-datatable-tbody > tr > td) {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  background-color: #fff;
}

:deep(.el-data-table .p-datatable-tbody > tr:hover > td) {
  background-color: #f3f4f6;
}

/* Footer */
.el-table-card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: rgba(249, 250, 251, 0.5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-table-card__footer-info {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.el-table-card__footer-nav {
  display: flex;
  gap: 0.5rem;
}

.el-table-card__nav-btn {
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
}

.el-table-card__nav-btn:hover:not(:disabled) {
  background-color: #f9fafb;
}

.el-table-card__nav-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty state */
.el-table-card__empty {
  padding: 3rem;
  text-align: center;
  color: #9ca3af;
}

.el-table-card__empty i {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.el-table-card__empty-hint {
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}
</style>
