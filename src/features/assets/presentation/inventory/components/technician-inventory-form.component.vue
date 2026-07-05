<script setup>
import { ref, computed } from 'vue';
import TechnicianInventoryAdjustTab from './technician-inventory-adjust-tab.component.vue';
import TechnicianInventoryAddTab from './technician-inventory-add-tab.component.vue';

const props = defineProps({
  componentOptions: { type: Array, default: () => [] },
  ownedComponentIds: { type: Array, default: () => [] }
});

const emit = defineEmits(['submit']);

const activeTab = ref('adjust'); // 'adjust' or 'add'

// Filter component options based on active tab
const ownedOptions = computed(() => {
    return props.componentOptions.filter(opt => props.ownedComponentIds.includes(opt.value));
});

const unownedOptions = computed(() => {
    return props.componentOptions.filter(opt => !props.ownedComponentIds.includes(opt.value));
});

function handleSubmit(payload) {
    emit('submit', payload);
}
</script>

<template>
  <section class="ti-form-card">
    <div class="ti-form-card__header">
        <div class="ti-tabs">
            <button 
                class="ti-tab" 
                :class="{ 'ti-tab--active': activeTab === 'adjust' }"
                @click="activeTab = 'adjust'"
            >
                <i class="pi pi-sync"></i> Adjust Stock
            </button>
            <button 
                class="ti-tab" 
                :class="{ 'ti-tab--active': activeTab === 'add' }"
                @click="activeTab = 'add'"
            >
                <i class="pi pi-plus-circle"></i> Add Components
            </button>
        </div>
    </div>
    
    <!-- Render Adjust Tab -->
    <technician-inventory-adjust-tab 
        v-if="activeTab === 'adjust'"
        :options="ownedOptions"
        @submit="handleSubmit"
    />

    <!-- Render Add Tab -->
    <technician-inventory-add-tab 
        v-if="activeTab === 'add'"
        :options="unownedOptions"
        @submit="handleSubmit"
    />
  </section>
</template>

<style scoped>
.ti-form-card {
  background-color: #fff;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.ti-form-card__header {
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.ti-tabs {
    display: flex;
}

.ti-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--el-warm-gray);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
}

.ti-tab:hover:not(.ti-tab--active) {
    color: var(--el-primary);
    background-color: #f3f4f6;
}

.ti-tab--active {
    color: var(--el-brand);
    border-bottom-color: var(--el-brand);
    background-color: white;
}
</style>
