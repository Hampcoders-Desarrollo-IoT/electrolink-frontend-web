import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { InventoryApiService } from '../infrastructure/services/inventory-api.service.js';
import { TechnicianInventoryAssembler } from '../infrastructure/assemblers/technician-inventory.assembler.js';

const inventoryApi = new InventoryApiService();

export const useTechnicianInventoryStore = defineStore('technicianInventory', () => {
    const inventory = ref(null);
    const detailedStockItems = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    const stockItems = computed(() => inventory.value?.stockItems || []);
    const totalItemsCount = computed(() => stockItems.value.reduce((sum, item) => sum + item.quantityAvailable, 0));
    const lowStockItems = computed(() => stockItems.value.filter(item => item.quantityAvailable <= item.alertThreshold));

    async function createInventory(technicianId) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.createInventory(technicianId);
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
                return inventory.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error creating inventory:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function loadInventory(technicianId) {
        if (!technicianId || technicianId === 'undefined') {
            console.warn('[InventoryStore] Skipping load because technicianId is undefined');
            return;
        }
        isLoading.value = true;
        try {
            const response = await inventoryApi.getInventory(technicianId);
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading inventory:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Fetches detailed stock items from GET /inventory/stock-items.
     * This endpoint returns ComponentStockResource[] with componentName included.
     */
    async function loadStockItems(technicianId) {
        if (!technicianId || technicianId === 'undefined') return;
        isLoading.value = true;
        try {
            const response = await inventoryApi.getStockItems(technicianId);
            if (response && response.data) {
                detailedStockItems.value = TechnicianInventoryAssembler.toEntityListFromStockItems(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading stock items:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function addStockItem(technicianId, command) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.addStock(technicianId, command);
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
                // Reload detailed items to get updated names
                await loadStockItems(technicianId);
                return inventory.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error adding stock item:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateComponentStock(technicianId, componentId, command) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.updateStock(technicianId, componentId, command);
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
                return inventory.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error updating stock:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function removeComponentStock(technicianId, componentId) {
        isLoading.value = true;
        try {
            await inventoryApi.removeStock(technicianId, componentId);
            if (inventory.value && inventory.value.stockItems) {
                inventory.value.stockItems = inventory.value.stockItems.filter(
                    item => item.componentId !== componentId
                );
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error removing stock:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function increaseStock(technicianId, componentId, amount) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.increaseStock(technicianId, componentId, { amount });
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
                await loadStockItems(technicianId);
                return inventory.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error increasing stock:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function decreaseStock(technicianId, componentId, amount) {
        isLoading.value = true;
        try {
            const response = await inventoryApi.decreaseStock(technicianId, componentId, { amount });
            if (response && response.data) {
                inventory.value = TechnicianInventoryAssembler.toEntityFromResource(response.data);
                await loadStockItems(technicianId);
                return inventory.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error decreasing stock:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        inventory,
        isLoading,
        errors,
        stockItems,
        detailedStockItems,
        totalItemsCount,
        lowStockItems,
        createInventory,
        loadInventory,
        loadStockItems,
        addStockItem,
        updateComponentStock,
        removeComponentStock,
        increaseStock,
        decreaseStock
    };
});

export default useTechnicianInventoryStore;
