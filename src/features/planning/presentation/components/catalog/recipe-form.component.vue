<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useServiceCatalogStore } from '../../../application/service-catalog.store.js';
import { useComponentTypeStore } from '../../../../assets/application/component-type.store.js';
import { CreateServiceRecipeCommand } from '../../../domain/commands/create-service-recipe.command.js';
import { UpdateServiceRecipeCommand } from '../../../domain/commands/update-service-recipe.command.js';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    recipe: { type: Object, default: null }
});

const emit = defineEmits(['close', 'saved']);

const store = useServiceCatalogStore();
const componentTypeStore = useComponentTypeStore();
const toast = useToast();

const componentTypeOptions = computed(() =>
    componentTypeStore.componentTypes.map(ct => ({
        label: ct.name || ct.id,
        value: ct.id
    }))
);

const form = reactive({
    serviceName: '',
    serviceDescription: '',
    serviceCategory: '',
    requiresIoTCertification: false,
    componentRequirements: [],
    estimatedDurationMinutes: 60,
    materialsEstimate: 0,
    laborCost: 0,
    currency: 'USD',
    prerequisites: [],
    deliverables: [],
    warrantyMonths: 0
});

const totalPrice = computed(() => form.materialsEstimate + form.laborCost);

const isSaving = ref(false);
const componentsExpanded = ref(false);

onMounted(async () => {
    componentTypeStore.loadComponentTypes('me');
    if (props.recipe) {
        Object.assign(form, {
            serviceName: props.recipe.serviceName,
            serviceDescription: props.recipe.serviceDescription,
            serviceCategory: props.recipe.serviceCategory,
            requiresIoTCertification: props.recipe.requiresIoTCertification || false,
            componentRequirements: props.recipe.componentRequirements.map(c => ({ ...c })),
            estimatedDurationMinutes: props.recipe.estimatedDurationMinutes,
            materialsEstimate: props.recipe.materialsEstimate,
            laborCost: props.recipe.laborCost,
            currency: props.recipe.currency,
            prerequisites: [...props.recipe.prerequisites],
            deliverables: [...props.recipe.deliverables],
            warrantyMonths: props.recipe.warrantyMonths
        });
    }
});

function addComponent() {
    form.componentRequirements.push({ componentTypeId: '', quantity: 1, isRequired: true });
}

function removeComponent(index) {
    form.componentRequirements.splice(index, 1);
}

function addPrerequisite() {
    form.prerequisites.push('');
}

function removePrerequisite(index) {
    form.prerequisites.splice(index, 1);
}

function addDeliverable() {
    form.deliverables.push('');
}

function removeDeliverable(index) {
    form.deliverables.splice(index, 1);
}

async function save() {
    isSaving.value = true;
    try {
        const command = {
            serviceName: form.serviceName,
            serviceDescription: form.serviceDescription,
            serviceCategory: form.serviceCategory,
            requiresIoTCertification: form.requiresIoTCertification,
            componentRequirements: form.componentRequirements,
            estimatedDurationHours: Math.floor(form.estimatedDurationMinutes / 60),
            estimatedDurationMinutes: form.estimatedDurationMinutes % 60,
            pricing: {
                materialsEstimate: form.materialsEstimate,
                laborCost: form.laborCost,
                totalPrice: totalPrice.value,
                currency: form.currency
            },
            prerequisites: form.prerequisites,
            deliverables: form.deliverables,
            warrantyMonths: form.warrantyMonths
        };
        if (props.recipe) {
            await store.updateRecipe('me', props.recipe.recipeId, new UpdateServiceRecipeCommand({ recipeId: props.recipe.recipeId, ...command }));
        } else {
            await store.createRecipe('me', new CreateServiceRecipeCommand(command));
        }
        toast.add({ severity: 'success', summary: 'Saved', detail: 'Recipe saved successfully.', life: 3000 });
        emit('saved');
    } catch (error) {
        console.error('[RecipeForm] save failed:', error);
        const detail = error.response?.data?.message || error.message || 'An unexpected error occurred';
        toast.add({ severity: 'error', summary: 'Error', detail, life: 5000 });
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
  <div class="recipe-form">
    <div class="recipe-form__field">
      <label>Service Name</label>
      <el-input-text v-model="form.serviceName" placeholder="Service name" />
    </div>
    <div class="recipe-form__field">
      <label>Description</label>
      <el-textarea v-model="form.serviceDescription" placeholder="Service description" />
    </div>
    <div class="recipe-form__row">
      <div class="recipe-form__field">
        <label>Category</label>
        <el-select
          v-model="form.serviceCategory"
          :options="[
            { label: 'Electrical Repair', value: 'Electrical Repair' },
            { label: 'Installation', value: 'Installation' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Inspection', value: 'Inspection' },
            { label: 'IoT Setup', value: 'IoT Setup' }
          ]"
          optionLabel="label"
          optionValue="value"
          placeholder="Select category"
        />
      </div>
      <div class="recipe-form__field">
        <label>Duration (min)</label>
        <el-input-text v-model.number="form.estimatedDurationMinutes" type="number" min="1" />
      </div>
      <div class="recipe-form__field recipe-form__field--checkbox">
        <el-checkbox v-model="form.requiresIoTCertification" label="Requires IoT Certification" />
      </div>
    </div>
    <div class="recipe-form__row">
      <div class="recipe-form__field">
        <label>Materials ($)</label>
        <el-input-text v-model.number="form.materialsEstimate" type="number" min="0" step="0.01" />
      </div>
      <div class="recipe-form__field">
        <label>Labor ($)</label>
        <el-input-text v-model.number="form.laborCost" type="number" min="0" step="0.01" />
      </div>
      <div class="recipe-form__field">
        <label>Total ($)</label>
        <el-input-text :model-value="totalPrice.toFixed(2)" disabled type="number" />
      </div>
      <div class="recipe-form__field">
        <label>Currency</label>
        <el-select
          v-model="form.currency"
          :options="[
            { label: 'USD', value: 'USD' },
            { label: 'EUR', value: 'EUR' },
            { label: 'PEN', value: 'PEN' },
            { label: 'MXN', value: 'MXN' }
          ]"
          optionLabel="label"
          optionValue="value"
        />
      </div>
    </div>
    <div class="recipe-form__field">
      <label>Warranty (months)</label>
      <el-input-text v-model.number="form.warrantyMonths" type="number" min="0" />
    </div>
    <div class="recipe-form__section-toggle" @click="componentsExpanded = !componentsExpanded">
      <i class="pi" :class="componentsExpanded ? 'pi-chevron-down' : 'pi-chevron-right'"></i>
      <label>Required Components ({{ form.componentRequirements.length }})</label>
    </div>
    <div v-if="componentsExpanded" class="recipe-form__field">
      <div v-for="(comp, index) in form.componentRequirements" :key="index" class="recipe-form__comp-row">
        <el-select v-model="comp.componentTypeId" :options="componentTypeOptions" optionLabel="label" optionValue="value" placeholder="Select component type..." filterable class="recipe-form__comp-select" />
        <el-input-text v-model.number="comp.quantity" type="number" min="1" placeholder="Qty" class="recipe-form__qty" />
        <el-checkbox v-model="comp.isRequired" label="Required" />
        <el-button icon="pi pi-trash" variant="ghost" severity="danger" @click="removeComponent(index)" />
      </div>
      <el-button label="Add Component" icon="pi pi-plus" variant="ghost" @click="addComponent" />
    </div>
    <div class="recipe-form__field">
      <label>Prerequisites</label>
      <div v-for="(item, index) in form.prerequisites" :key="'pre-' + index" class="recipe-form__list-row">
        <el-input-text v-model="form.prerequisites[index]" placeholder="e.g. IoT Certification Required" />
        <el-button icon="pi pi-trash" variant="ghost" severity="danger" @click="removePrerequisite(index)" />
      </div>
      <el-button label="Add Prerequisite" icon="pi pi-plus" variant="ghost" @click="addPrerequisite" />
    </div>
    <div class="recipe-form__field">
      <label>Deliverables</label>
      <div v-for="(item, index) in form.deliverables" :key="'del-' + index" class="recipe-form__list-row">
        <el-input-text v-model="form.deliverables[index]" placeholder="e.g. Installation Report" />
        <el-button icon="pi pi-trash" variant="ghost" severity="danger" @click="removeDeliverable(index)" />
      </div>
      <el-button label="Add Deliverable" icon="pi pi-plus" variant="ghost" @click="addDeliverable" />
    </div>
    <div class="recipe-form__actions">
      <el-button label="Cancel" variant="ghost" @click="emit('close')" />
      <el-button :label="isSaving ? 'Saving...' : 'Save'" :disabled="isSaving" @click="save" />
    </div>
  </div>
</template>

<style scoped>
.recipe-form { display: flex; flex-direction: column; gap: 1rem; }
.recipe-form__field { display: flex; flex-direction: column; gap: 0.35rem; }
.recipe-form__field label { font-weight: 600; font-size: 0.85rem; color: var(--el-primary); }
.recipe-form__row { display: flex; gap: 1rem; }
.recipe-form__row .recipe-form__field { flex: 1; }
.recipe-form__comp-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.recipe-form__comp-select { min-width: 220px; flex: 1; }
.recipe-form__list-row { display: flex; gap: 0.5rem; align-items: center; }
.recipe-form__qty { width: 80px; }
.recipe-form__section-toggle { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.35rem 0; user-select: none; }
.recipe-form__section-toggle label { font-weight: 600; font-size: 0.85rem; color: var(--el-primary); cursor: pointer; }
.recipe-form__section-toggle i { font-size: 0.85rem; color: var(--el-warm-gray); transition: transform 0.2s; }
.recipe-form__field--checkbox { justify-content: flex-end; padding-bottom: 0.25rem; }
.recipe-form__actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
</style>
