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

function openCreateForm() {
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
      <h2 class="catalog-dashboard__title">Service Catalog</h2>
      <el-button label="New Recipe" icon="pi pi-plus" @click="openCreateForm" />
    </div>
    <div class="catalog-dashboard__grid">
      <div class="catalog-dashboard__column">
        <h3 class="catalog-dashboard__column-title">Active Recipes ({{ store.activeRecipes.length }})</h3>
        <RecipeCard
          v-for="recipe in store.activeRecipes"
          :key="recipe.recipeId"
          :recipe="recipe"
          @edit="openEditForm(recipe)"
        />
      </div>
      <div class="catalog-dashboard__column">
        <h3 class="catalog-dashboard__column-title">Inactive Recipes ({{ store.inactiveRecipes.length }})</h3>
        <RecipeCard
          v-for="recipe in store.inactiveRecipes"
          :key="recipe.recipeId"
          :recipe="recipe"
          @edit="openEditForm(recipe)"
        />
      </div>
    </div>
    <pv-dialog v-model:visible="showForm" :header="editingRecipe ? 'Edit Recipe' : 'New Recipe'" :modal="true" :style="{ width: '600px' }">
      <RecipeForm :recipe="editingRecipe" @close="onFormClose" @saved="onFormClose" />
    </pv-dialog>
  </div>
</template>

<style scoped>
.catalog-dashboard__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.catalog-dashboard__title { margin: 0; color: var(--el-primary); }
.catalog-dashboard__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.catalog-dashboard__column-title { font-size: 1rem; color: var(--el-warm-gray); margin: 0 0 1rem; }
</style>
