import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PropertiesApiService } from '../infrastructure/services/properties-api.service.js';
import { PropertyAssembler } from '../infrastructure/assemblers/property.assembler.js';

const propertiesApi = new PropertiesApiService();

export const usePropertyStore = defineStore('property', () => {
    const properties = ref([]);
    const selectedProperty = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    // ── Computed ──────────────────────────────────────────────────────────────
    const totalProperties = computed(() => properties.value.length);
    const activeProperties = computed(() => properties.value.filter(p => p.isActive).length);
    const inactiveProperties = computed(() => properties.value.filter(p => !p.isActive).length);

    // Status-based computeds (el status viene del backend como string)
    const occupiedProperties = computed(() =>
        properties.value.filter(p => p.status === 'OwnerOccupied' || p.status === 'Rented').length
    );
    const maintenanceProperties = computed(() =>
        properties.value.filter(p => p.status === 'UnderRenovation').length
    );
    const vacantProperties = computed(() =>
        properties.value.filter(p => p.status === 'Vacant').length
    );

    const occupancyRate = computed(() => {
        if (!totalProperties.value) return 0;
        return Math.round((occupiedProperties.value / totalProperties.value) * 100);
    });

    // ── Actions ───────────────────────────────────────────────────────────────
    async function loadProperties(homeownerId) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.getAll(homeownerId);
            if (response && response.data) {
                properties.value = PropertyAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading properties:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function getPropertyById(homeownerId, propertyId) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.getById(homeownerId, propertyId);
            if (response && response.data) {
                const property = PropertyAssembler.toEntityFromResource(response.data);
                selectedProperty.value = property;
                return property;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error getting property:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function createProperty(homeownerId, command) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.create(homeownerId, command);
            if (response && response.data) {
                const newProperty = PropertyAssembler.toEntityFromResource(response.data);
                properties.value.push(newProperty);
                return newProperty;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error creating property:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateAddress(homeownerId, propertyId, resource) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.updateAddress(homeownerId, propertyId, resource);
            if (response && response.data) {
                const updated = PropertyAssembler.toEntityFromResource(response.data);
                const index = properties.value.findIndex(p => p.id === propertyId);
                if (index !== -1) properties.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error updating address:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateGeolocation(homeownerId, propertyId, resource) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.updateGeolocation(homeownerId, propertyId, resource);
            if (response && response.data) {
                const updated = PropertyAssembler.toEntityFromResource(response.data);
                const index = properties.value.findIndex(p => p.id === propertyId);
                if (index !== -1) properties.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error updating geolocation:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function activateProperty(homeownerId, propertyId) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.activate(homeownerId, propertyId);
            if (response && response.data) {
                const updated = PropertyAssembler.toEntityFromResource(response.data);
                const index = properties.value.findIndex(p => p.id === propertyId);
                if (index !== -1) properties.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error activating property:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function deactivateProperty(homeownerId, propertyId) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.deactivate(homeownerId, propertyId);
            if (response && response.data) {
                const updated = PropertyAssembler.toEntityFromResource(response.data);
                const index = properties.value.findIndex(p => p.id === propertyId);
                if (index !== -1) properties.value[index] = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error deactivating property:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function deleteProperty(homeownerId, propertyId, reason = '') {
        isLoading.value = true;
        try {
            await propertiesApi.delete(homeownerId, propertyId, reason);
            properties.value = properties.value.filter(p => p.id !== propertyId);
        } catch (error) {
            errors.value.push(error);
            console.error('Error deleting property:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    function selectProperty(property) {
        selectedProperty.value = property;
    }

    return {
        // State
        properties,
        selectedProperty,
        isLoading,
        errors,
        // Computed
        totalProperties,
        activeProperties,
        inactiveProperties,
        occupiedProperties,
        maintenanceProperties,
        vacantProperties,
        occupancyRate,
        // Actions
        loadProperties,
        getPropertyById,
        createProperty,
        updateAddress,
        updateGeolocation,
        activateProperty,
        deactivateProperty,
        deleteProperty,
        selectProperty
    };
});

export default usePropertyStore;
