import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ComponentApiService } from '../infrastructure/services/component-api.service.js';
import { InventoryAdjustmentAssembler } from '../infrastructure/assemblers/inventory-adjustment.assembler.js';

const componentApi = new ComponentApiService();

export const useComponentStore = defineStore('component', () => {
    const adjustments = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    async function loadAdjustments() {
        isLoading.value = true;
        try {
            const response = await componentApi.getAdjustments();
            if (response && response.data) {
                adjustments.value = InventoryAdjustmentAssembler.toEntityList(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading adjustments:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function createAdjustment(command) {
        isLoading.value = true;
        try {
            const response = await componentApi.createAdjustment(command);
            if (response && response.data) {
                const newAdjustment = InventoryAdjustmentAssembler.toEntity(response.data);
                adjustments.value.unshift(newAdjustment);
                return newAdjustment;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error creating adjustment:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        adjustments,
        isLoading,
        errors,
        loadAdjustments,
        createAdjustment
    };
});

export default useComponentStore;
