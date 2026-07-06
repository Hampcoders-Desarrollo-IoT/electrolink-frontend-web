<script setup>
import { ref, computed } from 'vue';
import { useServiceCatalogStore } from '../../../application/service-catalog.store.js';
import { DeactivateServiceRecipeCommand } from '../../../domain/commands/deactivate-service-recipe.command.js';

const props = defineProps({
    recipe: { type: Object, required: true }
});

const emit = defineEmits(['edit', 'deactivated', 'reactivated']);

const store = useServiceCatalogStore();
const showDeactivateDialog = ref(false);
const deactivateReason = ref('');
const deactivateNotes = ref('');

const categorySeverity = computed(() => {
    const map = {
        'Electrical Repair': 'danger',
        'Installation': 'info',
        'Maintenance': 'warn',
        'Inspection': 'success',
        'IoT Setup': 'info'
    };
    return map[props.recipe.serviceCategory] || 'info';
});

const categoryColor = computed(() => {
    const map = {
        'Electrical Repair': '#ef4444',
        'Installation': '#3b82f6',
        'Maintenance': '#f59e0b',
        'Inspection': '#10b981',
        'IoT Setup': '#8b5cf6'
    };
    return map[props.recipe.serviceCategory] || 'var(--el-warm-gray)';
});

async function confirmDeactivate() {
    const command = new DeactivateServiceRecipeCommand({
        recipeId: props.recipe.recipeId,
        reason: deactivateReason.value,
        notes: deactivateNotes.value
    });
    await store.deactivateRecipe('me', props.recipe.recipeId, command);
    showDeactivateDialog.value = false;
    deactivateReason.value = '';
    deactivateNotes.value = '';
    emit('deactivated', props.recipe.recipeId);
}

async function reactivate() {
    await store.reactivateRecipe('me', props.recipe.recipeId);
    emit('reactivated', props.recipe.recipeId);
}
</script>

<template>
  <div :class="['recipe-card', { 'recipe-card--inactive': !recipe.isActive }]">
    <div class="recipe-card__header">
      <div class="recipe-card__header-info">
        <h4 class="recipe-card__name">{{ recipe.serviceName }}</h4>
        <span v-if="recipe.timesRequested > 0" class="recipe-card__times">({{ recipe.timesRequested }}x)</span>
      </div>
      <pv-tag :value="recipe.serviceCategory" :severity="categorySeverity" class="recipe-card__category-tag" />
    </div>
    <p v-if="recipe.serviceDescription" class="recipe-card__desc">{{ recipe.serviceDescription }}</p>
    <div class="recipe-card__meta">
      <span class="recipe-card__meta-item"><i class="pi pi-clock"></i> {{ recipe.estimatedDurationMinutes }}min</span>
      <span class="recipe-card__meta-item"><i class="pi pi-dollar"></i> {{ recipe.totalPrice }} {{ recipe.currency }}</span>
    </div>
    <div class="recipe-card__warranty" v-if="recipe.warrantyMonths > 0">
      <i class="pi pi-shield"></i> {{ recipe.warrantyMonths }}-month warranty
    </div>
    <div class="recipe-card__actions">
      <el-button icon="pi pi-pencil" variant="ghost" @click="emit('edit', recipe)" />
      <el-button
        v-if="recipe.isActive"
        icon="pi pi-ban"
        variant="ghost"
        severity="danger"
        @click="showDeactivateDialog = true"
      />
      <el-button
        v-else
        icon="pi pi-refresh"
        variant="ghost"
        severity="success"
        @click="reactivate"
      />
    </div>

    <pv-dialog v-model:visible="showDeactivateDialog" header="Deactivate Recipe" :modal="true" :style="{ width: '450px' }">
      <div class="recipe-card__deactivate-form">
        <p class="recipe-card__deactivate-hint">Are you sure you want to deactivate <strong>{{ recipe.serviceName }}</strong>? This recipe will no longer be available for new service requests.</p>
        <div class="recipe-card__deactivate-field">
          <label>Reason <span class="recipe-card__required">*</span></label>
          <el-input-text v-model="deactivateReason" placeholder="e.g. No longer offered, replaced by new version" />
        </div>
        <div class="recipe-card__deactivate-field">
          <label>Notes <span class="recipe-card__optional">(optional)</span></label>
          <el-textarea v-model="deactivateNotes" placeholder="Additional notes for internal reference" />
        </div>
      </div>
      <template #footer>
        <div class="recipe-card__dialog-footer">
          <el-button label="Cancel" variant="ghost" @click="showDeactivateDialog = false" />
          <el-button label="Deactivate" severity="danger" :disabled="!deactivateReason" @click="confirmDeactivate" />
        </div>
      </template>
    </pv-dialog>
  </div>
</template>

<style scoped>
.recipe-card {
  background: white; border: 1px solid rgba(169, 177, 186, 0.2);
  border-left: 4px solid var(--el-success);
  border-radius: 12px; padding: 1rem; margin-bottom: 0.75rem;
  transition: box-shadow 0.2s;
}
.recipe-card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06); }
.recipe-card--inactive { border-left-color: var(--el-warm-gray); opacity: 0.75; }

.recipe-card__header { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; }
.recipe-card__header-info { display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 0; }
.recipe-card__name { margin: 0; font-size: 0.95rem; color: var(--el-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recipe-card__times { font-size: 0.75rem; color: var(--el-warm-gray); white-space: nowrap; }
.recipe-card__category-tag { flex-shrink: 0; }

.recipe-card__desc { font-size: 0.8rem; color: var(--el-warm-gray); margin: 0 0 0.75rem; line-height: 1.4; }
.recipe-card__meta { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap; }
.recipe-card__meta-item { font-size: 0.75rem; color: var(--el-warm-gray); }
.recipe-card__meta-item i { margin-right: 0.25rem; }
.recipe-card__warranty { font-size: 0.75rem; color: var(--el-warm-gray); margin-bottom: 0.5rem; }
.recipe-card__warranty i { margin-right: 0.25rem; }
.recipe-card__actions { display: flex; justify-content: flex-end; gap: 0.25rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(169, 177, 186, 0.15); }

.recipe-card__deactivate-form { display: flex; flex-direction: column; gap: 1rem; }
.recipe-card__deactivate-hint { font-size: 0.9rem; color: var(--el-primary); margin: 0; }
.recipe-card__deactivate-field { display: flex; flex-direction: column; gap: 0.35rem; }
.recipe-card__deactivate-field label { font-weight: 600; font-size: 0.85rem; color: var(--el-primary); }
.recipe-card__required { color: var(--el-danger); }
.recipe-card__optional { font-weight: 400; color: var(--el-warm-gray); font-size: 0.8rem; }
.recipe-card__dialog-footer { display: flex; justify-content: flex-end; gap: 0.5rem; }
</style>
