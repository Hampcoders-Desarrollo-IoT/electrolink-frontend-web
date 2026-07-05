<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    components: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['edit', 'delete']);

const globalFilter = ref('');

const filteredItems = computed(() => {
    if (!globalFilter.value) return props.components;
    const filter = globalFilter.value.toLowerCase();
    return props.components.filter(c =>
        (c.name || '').toLowerCase().includes(filter) ||
        (c.description || '').toLowerCase().includes(filter)
    );
});

function getStatusLabel(item) {
    return item.isActive ? 'Active' : 'Inactive';
}

</script>

<template>
  <el-table-card
    :items="filteredItems"
    :loading="isLoading"
    v-model:filter="globalFilter"
    searchPlaceholder="Search components..."
    totalLabel="components"
    emptyMessage="No components found"
    emptyHint="Create one using the button above"
  >
    <template #columns>
      <pv-column field="name" header="COMPONENT" sortable>
        <template #body="{ data }">
          <div>
            <div class="cc-cell-title">{{ data.name }}</div>
            <div class="cc-cell-id">ID: {{ data.id }}</div>
          </div>
        </template>
      </pv-column>

      <pv-column field="description" header="DESCRIPTION" sortable>
        <template #body="{ data }">
          <span class="cc-cell-desc">{{ data.description || '—' }}</span>
        </template>
      </pv-column>

      <pv-column field="isActive" header="STATUS" sortable>
        <template #body="{ data }">
          <span
            class="cc-badge"
            :class="data.isActive ? 'cc-badge--active' : 'cc-badge--inactive'"
          >
            <i :class="data.isActive ? 'pi pi-check-circle' : 'pi pi-ban'"></i>
            {{ getStatusLabel(data).toUpperCase() }}
          </span>
        </template>
      </pv-column>

      <pv-column header="ACTIONS">
        <template #body="{ data }">
          <div class="cc-actions">
            <pv-button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-sm"
              v-tooltip.top="'Edit'"
              @click="emit('edit', data)"
            />
            <pv-button
              icon="pi pi-trash"
              class="p-button-text p-button-rounded p-button-danger p-button-sm"
              v-tooltip.top="'Delete'"
              @click="emit('delete', data)"
            />
          </div>
        </template>
      </pv-column>
    </template>
  </el-table-card>
</template>

<style scoped>
.cc-cell-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
}

.cc-cell-id {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.cc-cell-desc {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.cc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border-width: 1px;
}

.cc-badge--active {
  background-color: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
}

.cc-badge--inactive {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #e5e7eb;
}

.cc-actions {
  display: flex;
  gap: 0.25rem;
}
</style>
