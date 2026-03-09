import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { InventoryApiService } from '../infrastructure/services/inventory-api.service.js';
import { InventoryItemAssembler } from '../infrastructure/assemblers/inventory-item.assembler.js';

const inventoryApi = new InventoryApiService();

export const useInventoryStore = defineStore('inventory', () => {
    const inventory = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    const totalItemsCount = computed(() => inventory.value.reduce((sum, item) => sum + item.stock, 0));
    const lowStockItems = computed(() => inventory.value.filter(item => item.isLowStock || item.isCriticalStock));
    const categoriesCount = computed(() => new Set(inventory.value.map(item => item.category)).size);
    const totalInventoryValue = computed(() => inventory.value.reduce((sum, item) => sum + item.totalValue, 0));

    async function loadInventory() {
        isLoading.value = true;
        try {
            const response = await inventoryApi.getAll();
            if (response && response.data) {
                inventory.value = InventoryItemAssembler.toEntityList(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading inventory:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function addStock(command) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.addStock(command);
            if (response && response.data) {
                const updatedItem = InventoryItemAssembler.toEntity(response.data);
                const index = inventory.value.findIndex(item => item.id === updatedItem.id);
                if (index !== -1) {
                    inventory.value[index] = updatedItem;
                }
                return updatedItem;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error adding stock:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        inventory,
        isLoading,
        errors,
        totalItemsCount,
        lowStockItems,
        categoriesCount,
        totalInventoryValue,
        loadInventory,
        addStock
    };
});

export default useInventoryStore;
