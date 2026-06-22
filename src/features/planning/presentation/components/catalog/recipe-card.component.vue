<script setup>
import { useServiceCatalogStore } from '../../../application/service-catalog.store.js';

const props = defineProps({
    recipe: { type: Object, required: true }
});

const emit = defineEmits(['edit', 'deactivate', 'reactivate']);

const store = useServiceCatalogStore();

async function deactivate() {
    await store.deactivateRecipe('me', props.recipe.recipeId);
    emit('deactivate', props.recipe.recipeId);
}

async function reactivate() {
    await store.reactivateRecipe('me', props.recipe.recipeId);
    emit('reactivate', props.recipe.recipeId);
}
</script>

<template>
  <div class="recipe-card">
    <div class="recipe-card__header">
      <h4 class="recipe-card__name">{{ recipe.name }}</h4>
      <pv-tag v-if="recipe.requiresIoTCertification" value="IoT" severity="info" />
    </div>
    <p class="recipe-card__desc">{{ recipe.description }}</p>
    <div class="recipe-card__meta">
      <el-chip :label="recipe.category" />
      <span class="recipe-card__meta-item"><i class="pi pi-clock"></i> {{ recipe.estimatedDuration }}min</span>
      <span class="recipe-card__meta-item"><i class="pi pi-dollar"></i> ${{ recipe.basePrice }}</span>
    </div>
    <div class="recipe-card__actions">
      <el-button icon="pi pi-pencil" variant="text" @click="emit('edit', recipe)" />
      <el-button
        v-if="recipe.isActive"
        icon="pi pi-ban"
        variant="text"
        severity="danger"
        @click="deactivate"
      />
      <el-button
        v-else
        icon="pi pi-refresh"
        variant="text"
        severity="success"
        @click="reactivate"
      />
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;
}
.recipe-card__header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.recipe-card__name { margin: 0; font-size: 0.95rem; color: var(--el-primary); flex: 1; }
.recipe-card__desc { font-size: 0.8rem; color: var(--el-warm-gray); margin: 0 0 0.75rem; }
.recipe-card__meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.recipe-card__meta-item { font-size: 0.75rem; color: var(--el-warm-gray); }
.recipe-card__meta-item i { margin-right: 0.25rem; }
.recipe-card__actions { display: flex; justify-content: flex-end; gap: 0.25rem; }
</style>
