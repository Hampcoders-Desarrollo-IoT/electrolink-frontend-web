import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PropertiesApiService } from '../infrastructure/services/properties-api.service.js';
import { PropertyAssembler } from '../infrastructure/assemblers/property.assembler.js';

const propertiesApi = new PropertiesApiService();

export const usePropertiesStore = defineStore('properties', () => {
    const properties = ref([]);
    const selectedProperty = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    const totalProperties = computed(() => properties.value.length);
    const occupiedProperties = computed(() => properties.value.filter(p => p.isOccupied).length);
    const vacantProperties = computed(() => properties.value.filter(p => p.isVacant).length);
    const maintenanceProperties = computed(() => properties.value.filter(p => p.isUnderMaintenance).length);
    const occupancyRate = computed(() => {
        if (totalProperties.value === 0) return 0;
        return Math.round((occupiedProperties.value / totalProperties.value) * 1000) / 10;
    });
    const totalMonthlyRevenue = computed(() => properties.value.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0));

    async function loadProperties() {
        isLoading.value = true;
        try {
            const response = await propertiesApi.getAll();
            if (response && response.data) {
                properties.value = PropertyAssembler.toEntityList(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading properties:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function createProperty(command) {
        isLoading.value = true;
        try {
            const response = await propertiesApi.create(command);
            if (response && response.data) {
                const newProperty = PropertyAssembler.toEntity(response.data);
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

    async function deleteProperty(id) {
        isLoading.value = true;
        try {
            await propertiesApi.delete(id);
            properties.value = properties.value.filter(p => p.id !== id);
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
        properties,
        selectedProperty,
        isLoading,
        errors,
        totalProperties,
        occupiedProperties,
        vacantProperties,
        maintenanceProperties,
        occupancyRate,
        totalMonthlyRevenue,
        loadProperties,
        createProperty,
        deleteProperty,
        selectProperty
    };
});

export default usePropertiesStore;
