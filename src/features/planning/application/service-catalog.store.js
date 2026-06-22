import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceCatalogApiService } from '../infrastructure/services/service-catalog-api.service.js';
import { ServiceCatalogAssembler } from '../infrastructure/assemblers/service-catalog.assembler.js';
import { ServiceRecipeAssembler } from '../infrastructure/assemblers/service-recipe.assembler.js';

const api = new ServiceCatalogApiService();

export const useServiceCatalogStore = defineStore('serviceCatalog', () => {
    const catalog = ref(null);
    const recipes = ref([]);
    const selectedRecipe = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    const activeRecipes = computed(() => recipes.value.filter(r => r.isActive));
    const inactiveRecipes = computed(() => recipes.value.filter(r => !r.isActive));
    const iotRecipes = computed(() => recipes.value.filter(r => r.requiresIoTCertification));

    async function fetchCatalog(technicianId) {
        isLoading.value = true;
        try {
            const response = await api.getCatalog(technicianId);
            if (response && response.data) {
                catalog.value = ServiceCatalogAssembler.toEntityFromResource(response.data);
                recipes.value = catalog.value.recipes;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createRecipe(technicianId, command) {
        isLoading.value = true;
        try {
            const response = await api.createRecipe(technicianId, command);
            if (response && response.data) {
                const recipe = ServiceRecipeAssembler.toEntityFromResource(response.data);
                recipes.value.push(recipe);
                return recipe;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateRecipe(technicianId, recipeId, command) {
        isLoading.value = true;
        try {
            const response = await api.updateRecipe(technicianId, recipeId, command);
            if (response && response.data) {
                const updated = ServiceRecipeAssembler.toEntityFromResource(response.data);
                const index = recipes.value.findIndex(r => r.recipeId === recipeId);
                if (index !== -1) recipes.value[index] = updated;
                if (selectedRecipe.value?.recipeId === recipeId) selectedRecipe.value = updated;
                return updated;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deactivateRecipe(technicianId, recipeId) {
        isLoading.value = true;
        try {
            await api.deactivateRecipe(technicianId, recipeId);
            recipes.value = recipes.value.filter(r => r.recipeId !== recipeId);
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function reactivateRecipe(technicianId, recipeId) {
        isLoading.value = true;
        try {
            const response = await api.reactivateRecipe(technicianId, recipeId);
            if (response && response.data) {
                const recipe = ServiceRecipeAssembler.toEntityFromResource(response.data);
                recipes.value.push(recipe);
                return recipe;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    function selectRecipe(recipe) {
        selectedRecipe.value = recipe;
    }

    return {
        catalog,
        recipes,
        selectedRecipe,
        isLoading,
        errors,
        activeRecipes,
        inactiveRecipes,
        iotRecipes,
        fetchCatalog,
        createRecipe,
        updateRecipe,
        deactivateRecipe,
        reactivateRecipe,
        selectRecipe
    };
});

export default useServiceCatalogStore;
