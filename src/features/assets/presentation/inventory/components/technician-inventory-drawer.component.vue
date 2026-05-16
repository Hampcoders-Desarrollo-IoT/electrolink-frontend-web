<script setup>
import { ref, computed } from 'vue';
import { useTechnicianInventoryStore } from '../../../application/technician-inventory.store.js';
import { useComponentStore } from '../../../application/component.store.js';
import TechnicianInventoryForm from './technician-inventory-form.component.vue';

const inventoryStore = useTechnicianInventoryStore();
const componentStore = useComponentStore();

const props = defineProps({
    visible: { type: Boolean, default: false },
    technicianId: { type: String, required: true }
});

const emit = defineEmits(['update:visible', 'submit']);

// Owned component IDs (for tab filtering)
const ownedComponentIds = computed(() =>
    inventoryStore.stockItems.map(item => item.componentId)
);

// All catalog components as dropdown options
const componentOptions = computed(() =>
    componentStore.components.map(item => ({
        label: item.name,
        value: item.id
    }))
);

function handleSubmit(payload) {
    emit('submit', payload);
    emit('update:visible', false);
}

function handleClose() {
    emit('update:visible', false);
}
</script>

<template>
  <pv-drawer
    :visible="visible"
    position="right"
    :header="'Inventory Adjustment'"
    :style="{ width: '480px' }"
    @update:visible="handleClose"
  >
    <technician-inventory-form
        :componentOptions="componentOptions"
        :ownedComponentIds="ownedComponentIds"
        @submit="handleSubmit"
    />
  </pv-drawer>
</template>
