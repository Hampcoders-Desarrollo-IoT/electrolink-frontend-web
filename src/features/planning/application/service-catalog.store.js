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

    async function createCatalog(technicianId) {
        isLoading.value = true;
        try {
            await api.createCatalog(technicianId);
            await fetchCatalog(technicianId);
        } catch (error) {
            if (error.response && error.response.status === 409) {
                await fetchCatalog(technicianId);
            } else {
                errors.value.push(error);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchCatalog(technicianId) {
        isLoading.value = true;
        try {
            const response = await api.getCatalog(technicianId);
            if (response && response.data) {
                catalog.value = ServiceCatalogAssembler.toEntityFromResource(response.data);
                recipes.value = catalog.value.recipes;
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                catalog.value = null;
                recipes.value = [];
            } else {
                errors.value.push(error);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchRecipeDetail(technicianId, recipeId) {
        isLoading.value = true;
        try {
            const response = await api.getRecipe(technicianId, recipeId);
            if (response && response.data) {
                const recipe = ServiceRecipeAssembler.toEntityFromResource(response.data);
                const index = recipes.value.findIndex(r => r.recipeId === recipeId);
                if (index !== -1) recipes.value[index] = recipe;
                selectedRecipe.value = recipe;
                return recipe;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('[ServiceCatalogStore] fetchRecipeDetail failed:', error);
        } finally {
            isLoading.value = false;
        }
    }

    async function createRecipe(technicianId, command) {
        isLoading.value = true;
        try {
            const response = await api.createRecipe(technicianId, command);
            if (response && response.data && response.data.recipeId) {
                await fetchRecipeDetail(technicianId, response.data.recipeId);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('[ServiceCatalogStore] createRecipe failed:', error);
        } finally {
            isLoading.value = false;
        }
    }

    async function updateRecipe(technicianId, recipeId, command) {
        isLoading.value = true;
        try {
            await api.updateRecipe(technicianId, recipeId, command);
            await fetchRecipeDetail(technicianId, recipeId);
        } catch (error) {
            errors.value.push(error);
            console.error('[ServiceCatalogStore] updateRecipe failed:', error);
        } finally {
            isLoading.value = false;
        }
    }

    async function deactivateRecipe(technicianId, recipeId, command) {
        isLoading.value = true;
        try {
            await api.deactivateRecipe(technicianId, recipeId, command);
            const recipe = recipes.value.find(r => r.recipeId === recipeId);
            if (recipe) recipe.isActive = false;
        } catch (error) {
            errors.value.push(error);
            console.error('[ServiceCatalogStore] deactivateRecipe failed:', error);
        } finally {
            isLoading.value = false;
        }
    }

    async function reactivateRecipe(technicianId, recipeId) {
        isLoading.value = true;
        try {
            await api.reactivateRecipe(technicianId, recipeId);
            const recipe = recipes.value.find(r => r.recipeId === recipeId);
            if (recipe) recipe.isActive = true;
        } catch (error) {
            errors.value.push(error);
            console.error('[ServiceCatalogStore] reactivateRecipe failed:', error);
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
        createCatalog,
        fetchCatalog,
        fetchRecipeDetail,
        createRecipe,
        updateRecipe,
        deactivateRecipe,
        reactivateRecipe,
        selectRecipe
    };
});

export default useServiceCatalogStore;
