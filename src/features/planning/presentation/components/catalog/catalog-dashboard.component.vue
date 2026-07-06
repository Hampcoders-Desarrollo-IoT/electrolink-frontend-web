<script setup>
import { ref, onMounted } from 'vue';
import { useServiceCatalogStore } from '../../../application/service-catalog.store.js';
import RecipeCard from './recipe-card.component.vue';
import RecipeForm from './recipe-form.component.vue';

const store = useServiceCatalogStore();
const showForm = ref(false);
const editingRecipe = ref(null);

onMounted(async () => {
    await store.fetchCatalog('me');
});

async function openCreateForm() {
    if (!store.catalog) {
        try {
            await store.createCatalog('me');
        } catch {
            // proceed to open form even if catalog creation fails
        }
    }
    editingRecipe.value = null;
    showForm.value = true;
}

function openEditForm(recipe) {
    editingRecipe.value = recipe;
    showForm.value = true;
}

function onFormClose() {
    showForm.value = false;
    editingRecipe.value = null;
}
</script>

<template>
  <div class="catalog-dashboard">
    <div class="catalog-dashboard__header">
      <div>
        <h2 class="catalog-dashboard__title">My Recipe Catalog</h2>
        <span v-if="store.catalog" class="catalog-dashboard__subtitle">{{ store.catalog.totalRecipes }} services</span>
      </div>
      <el-button label="New Recipe" icon="pi pi-plus" @click="openCreateForm" :loading="store.isLoading" />
    </div>

    <div v-if="store.isLoading" class="catalog-dashboard__loading">
      <div class="catalog-dashboard__kpi">
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
        <pv-skeleton width="100%" height="80px" borderRadius="12px" />
      </div>
      <div class="catalog-dashboard__grid">
        <div class="catalog-dashboard__column">
          <pv-skeleton width="120px" height="20px" borderRadius="4px" class="catalog-dashboard__skeleton-title" />
          <pv-skeleton width="100%" height="120px" borderRadius="12px" />
          <pv-skeleton width="100%" height="120px" borderRadius="12px" />
        </div>
        <div class="catalog-dashboard__column">
          <pv-skeleton width="120px" height="20px" borderRadius="4px" class="catalog-dashboard__skeleton-title" />
          <pv-skeleton width="100%" height="120px" borderRadius="12px" />
        </div>
      </div>
    </div>
    <div v-else-if="!store.catalog" class="catalog-dashboard__empty">
      <i class="pi pi-book catalog-dashboard__empty-icon"></i>
      <p class="catalog-dashboard__empty-title">Your catalog is empty</p>
      <p class="catalog-dashboard__empty-desc">Your catalog is being set up. Please ensure your subscription is complete to start creating service recipes.</p>
    </div>
    <template v-else>
      <div class="catalog-dashboard__kpi">
        <div class="catalog-dashboard__kpi-card">
          <span class="catalog-dashboard__kpi-value">{{ store.catalog.totalRecipes }}</span>
          <span class="catalog-dashboard__kpi-label">Total Recipes</span>
        </div>
        <div class="catalog-dashboard__kpi-card catalog-dashboard__kpi-card--active">
          <span class="catalog-dashboard__kpi-value">{{ store.activeRecipes.length }}</span>
          <span class="catalog-dashboard__kpi-label">Active</span>
        </div>
        <div class="catalog-dashboard__kpi-card catalog-dashboard__kpi-card--inactive">
          <span class="catalog-dashboard__kpi-value">{{ store.inactiveRecipes.length }}</span>
          <span class="catalog-dashboard__kpi-label">Inactive</span>
        </div>
      </div>
      <div class="catalog-dashboard__grid">
        <div class="catalog-dashboard__column">
          <h3 class="catalog-dashboard__column-title">Active ({{ store.activeRecipes.length }})</h3>
          <RecipeCard
            v-for="recipe in store.activeRecipes"
            :key="recipe.recipeId"
            :recipe="recipe"
            @edit="openEditForm(recipe)"
          />
        </div>
        <div class="catalog-dashboard__column">
          <h3 class="catalog-dashboard__column-title">Inactive ({{ store.inactiveRecipes.length }})</h3>
          <RecipeCard
            v-for="recipe in store.inactiveRecipes"
            :key="recipe.recipeId"
            :recipe="recipe"
            @edit="openEditForm(recipe)"
          />
        </div>
      </div>
    </template>
    <pv-dialog v-model:visible="showForm" :header="editingRecipe ? 'Edit Recipe' : 'New Recipe'" :modal="true" :style="{ width: '700px' }">
      <RecipeForm :recipe="editingRecipe" @close="onFormClose" @saved="onFormClose" />
    </pv-dialog>
  </div>
</template>

<style scoped>
.catalog-dashboard__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.catalog-dashboard__title { margin: 0; color: var(--el-primary); }
.catalog-dashboard__subtitle { font-size: 0.85rem; color: var(--el-warm-gray); }

.catalog-dashboard__loading { display: flex; flex-direction: column; gap: 1.5rem; }
.catalog-dashboard__skeleton-title { margin-bottom: 0.75rem; }

.catalog-dashboard__kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.catalog-dashboard__kpi-card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px; padding: 1rem; text-align: center;
}
.catalog-dashboard__kpi-card--active { border-left: 4px solid var(--el-success); }
.catalog-dashboard__kpi-card--inactive { border-left: 4px solid var(--el-warm-gray); }
.catalog-dashboard__kpi-card:first-child { border-left: 4px solid var(--el-primary); }
.catalog-dashboard__kpi-value { display: block; font-size: 1.75rem; font-weight: 700; color: var(--el-primary); }
.catalog-dashboard__kpi-label { font-size: 0.8rem; color: var(--el-warm-gray); text-transform: uppercase; letter-spacing: 0.05em; }

.catalog-dashboard__empty { text-align: center; padding: 4rem 2rem; }
.catalog-dashboard__empty-icon { font-size: 3rem; color: var(--el-warm-gray); margin-bottom: 1rem; display: block; }
.catalog-dashboard__empty-title { font-size: 1.1rem; font-weight: 600; color: var(--el-primary); margin: 0 0 0.5rem; }
.catalog-dashboard__empty-desc { font-size: 0.9rem; color: var(--el-warm-gray); margin: 0; max-width: 400px; margin-inline: auto; }

.catalog-dashboard__grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 768px) { .catalog-dashboard__grid { grid-template-columns: 1fr 1fr; } }
.catalog-dashboard__column-title { font-size: 1rem; color: var(--el-warm-gray); margin: 0 0 1rem; }
</style>
