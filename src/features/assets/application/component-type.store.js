import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ComponentTypeApiService } from '../infrastructure/services/component-type-api.service.js';
import { ComponentTypeAssembler } from '../infrastructure/assemblers/component-type.assembler.js';

const componentTypeApi = new ComponentTypeApiService();

export const useComponentTypeStore = defineStore('componentType', () => {
    const componentTypes = ref([]);
    const selectedComponentType = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    async function loadComponentTypes(technicianId) {
        if (!technicianId) return;
        isLoading.value = true;
        try {
            const response = await componentTypeApi.getAll(technicianId);
            if (response && response.data) {
                componentTypes.value = ComponentTypeAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading component types:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function getComponentTypeById(technicianId, id) {
        isLoading.value = true;
        try {
            const response = await componentTypeApi.getById(technicianId, id);
            if (response && response.data) {
                const componentType = ComponentTypeAssembler.toEntityFromResource(response.data);
                selectedComponentType.value = componentType;
                return componentType;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error getting component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function createComponentType(technicianId, command) {
        isLoading.value = true;
        try {
            const response = await componentTypeApi.create(technicianId, command);
            if (response && response.data) {
                const newType = ComponentTypeAssembler.toEntityFromResource(response.data);
                componentTypes.value.push(newType);
                return newType;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error creating component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateComponentType(technicianId, id, command) {
        isLoading.value = true;
        try {
            const response = await componentTypeApi.update(technicianId, id, command);
            if (response && response.data) {
                const updated = ComponentTypeAssembler.toEntityFromResource(response.data);
                const index = componentTypes.value.findIndex(ct => ct.id === id);
                if (index !== -1) componentTypes.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error updating component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteComponentType(technicianId, id) {
        isLoading.value = true;
        try {
            await componentTypeApi.delete(technicianId, id);
            componentTypes.value = componentTypes.value.filter(ct => ct.id !== id);
        } catch (error) {
            errors.value.push(error);
            console.error('Error deleting component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    function selectComponentType(componentType) {
        selectedComponentType.value = componentType;
    }

    function clearSelection() {
        selectedComponentType.value = null;
    }

    async function activateComponentType(technicianId, id) {
        isLoading.value = true;
        try {
            const response = await componentTypeApi.activate(technicianId, id);
            if (response && response.data) {
                const updated = ComponentTypeAssembler.toEntityFromResource(response.data);
                const index = componentTypes.value.findIndex(ct => ct.id === id);
                if (index !== -1) componentTypes.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error activating component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function deactivateComponentType(technicianId, id) {
        isLoading.value = true;
        try {
            const response = await componentTypeApi.deactivate(technicianId, id);
            if (response && response.data) {
                const updated = ComponentTypeAssembler.toEntityFromResource(response.data);
                const index = componentTypes.value.findIndex(ct => ct.id === id);
                if (index !== -1) componentTypes.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error deactivating component type:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        componentTypes,
        selectedComponentType,
        isLoading,
        errors,
        loadComponentTypes,
        getComponentTypeById,
        createComponentType,
        updateComponentType,
        deleteComponentType,
        selectComponentType,
        clearSelection,
        activateComponentType,
        deactivateComponentType
    };
});

export default useComponentTypeStore;
