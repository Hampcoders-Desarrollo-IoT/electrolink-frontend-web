<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    componentTypes: { type: Array, default: () => [] },
    isLoading: { type: Boolean, default: false }
});

const emit = defineEmits(['edit', 'delete', 'activate', 'deactivate']);

const globalFilter = ref('');

const filteredItems = computed(() => {
    if (!globalFilter.value) return props.componentTypes;
    const filter = globalFilter.value.toLowerCase();
    return props.componentTypes.filter(ct =>
        (ct.name || '').toLowerCase().includes(filter) ||
        (ct.description || '').toLowerCase().includes(filter)
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
    searchPlaceholder="Search component types..."
    totalLabel="types"
    emptyMessage="No component types found"
    emptyHint="Create one using the button above"
  >
    <!-- Override search with local filtering -->
    <template #columns>
      <pv-column field="name" header="COMPONENT" sortable>
        <template #body="{ data }">
          <div>
            <div class="ct-cell-title">{{ data.name }}</div>
            <div class="ct-cell-id">ID: {{ data.id }}</div>
          </div>
        </template>
      </pv-column>

      <pv-column field="description" header="DESCRIPTION" sortable>
        <template #body="{ data }">
          <span class="ct-cell-desc">{{ data.description || '—' }}</span>
        </template>
      </pv-column>

      <pv-column field="isActive" header="STATUS" sortable>
        <template #body="{ data }">
          <span
            class="ct-badge"
            :class="data.isActive ? 'ct-badge--active' : 'ct-badge--inactive'"
          >
            <i :class="data.isActive ? 'pi pi-check-circle' : 'pi pi-ban'"></i>
            {{ getStatusLabel(data).toUpperCase() }}
          </span>
        </template>
      </pv-column>

      <pv-column header="ACTIONS">
        <template #body="{ data }">
          <div class="ct-actions">
            <pv-button
              icon="pi pi-pencil"
              class="p-button-text p-button-rounded p-button-sm"
              v-tooltip.top="'Edit'"
              @click="emit('edit', data)"
            />
            <pv-button
              :icon="data.isActive ? 'pi pi-ban' : 'pi pi-check-circle'"
              class="p-button-text p-button-rounded p-button-sm"
              :class="data.isActive ? 'p-button-warning' : 'p-button-success'"
              v-tooltip.top="data.isActive ? 'Deactivate' : 'Activate'"
              @click="data.isActive ? emit('deactivate', data) : emit('activate', data)"
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
.ct-cell-title {
  font-weight: 600;
  color: #111827;
  font-size: 0.9375rem;
}

.ct-cell-id {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.ct-cell-desc {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
}

.ct-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  border-width: 1px;
}

.ct-badge--active {
  background-color: #dcfce7;
  color: #16a34a;
  border-color: #bbf7d0;
}

.ct-badge--inactive {
  background-color: #f3f4f6;
  color: #4b5563;
  border-color: #e5e7eb;
}

.ct-actions {
  display: flex;
  gap: 0.25rem;
}
</style>
