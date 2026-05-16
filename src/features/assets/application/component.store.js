import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ComponentApiService } from '../infrastructure/services/component-api.service.js';
import { ComponentAssembler } from '../infrastructure/assemblers/component.assembler.js';

const componentApi = new ComponentApiService();

export const useComponentStore = defineStore('component', () => {
    const components = ref([]);
    const selectedComponent = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    async function loadComponents(technicianId) {
        if (!technicianId) return;
        isLoading.value = true;
        try {
            const response = await componentApi.getAll(technicianId);
            if (response && response.data) {
                components.value = ComponentAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading components:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function getComponentById(technicianId, id) {
        isLoading.value = true;
        try {
            const response = await componentApi.getById(technicianId, id);
            if (response && response.data) {
                const component = ComponentAssembler.toEntityFromResource(response.data);
                selectedComponent.value = component;
                return component;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error getting component:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function createComponent(technicianId, command) {
        isLoading.value = true;
        try {
            const response = await componentApi.create(technicianId, command);
            if (response && response.data) {
                const newComponent = ComponentAssembler.toEntityFromResource(response.data);
                components.value.push(newComponent);
                return newComponent;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error creating component:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateComponent(technicianId, id, command) {
        isLoading.value = true;
        try {
            const response = await componentApi.update(technicianId, id, command);
            if (response && response.data) {
                const updated = ComponentAssembler.toEntityFromResource(response.data);
                const index = components.value.findIndex(c => c.id === id);
                if (index !== -1) components.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error updating component:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteComponent(technicianId, id) {
        isLoading.value = true;
        try {
            await componentApi.delete(technicianId, id);
            components.value = components.value.filter(c => c.id !== id);
        } catch (error) {
            errors.value.push(error);
            console.error('Error deleting component:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    function selectComponent(component) {
        selectedComponent.value = component;
    }

    return {
        components,
        selectedComponent,
        isLoading,
        errors,
        loadComponents,
        getComponentById,
        createComponent,
        updateComponent,
        deleteComponent,
        selectComponent
    };
});

export default useComponentStore;
