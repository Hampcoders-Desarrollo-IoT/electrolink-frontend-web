<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useServiceCatalogStore } from '../../../application/service-catalog.store.js';
import { CreateServiceRecipeCommand } from '../../../domain/commands/create-service-recipe.command.js';
import { UpdateServiceRecipeCommand } from '../../../domain/commands/update-service-recipe.command.js';

const props = defineProps({
    recipe: { type: Object, default: null }
});

const emit = defineEmits(['close', 'saved']);

const store = useServiceCatalogStore();

const form = reactive({
    name: '',
    description: '',
    category: '',
    estimatedDuration: 60,
    basePrice: 0,
    requiresIoTCertification: false,
    requiredComponents: []
});

const isSaving = ref(false);

onMounted(() => {
    if (props.recipe) {
        Object.assign(form, {
            name: props.recipe.name,
            description: props.recipe.description,
            category: props.recipe.category,
            estimatedDuration: props.recipe.estimatedDuration,
            basePrice: props.recipe.basePrice,
            requiresIoTCertification: props.recipe.requiresIoTCertification,
            requiredComponents: [...props.recipe.requiredComponents]
        });
    }
});

function addComponent() {
    form.requiredComponents.push({ componentTypeId: '', quantity: 1 });
}

function removeComponent(index) {
    form.requiredComponents.splice(index, 1);
}

async function save() {
    isSaving.value = true;
    try {
        if (props.recipe) {
            const command = new UpdateServiceRecipeCommand({ recipeId: props.recipe.recipeId, ...form });
            await store.updateRecipe('me', props.recipe.recipeId, command);
        } else {
            const command = new CreateServiceRecipeCommand(form);
            await store.createRecipe('me', command);
        }
        emit('saved');
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
  <div class="recipe-form">
    <div class="recipe-form__field">
      <label>Name</label>
      <el-input-text v-model="form.name" placeholder="Service name" />
    </div>
    <div class="recipe-form__field">
      <label>Description</label>
      <el-textarea v-model="form.description" placeholder="Service description" />
    </div>
    <div class="recipe-form__row">
      <div class="recipe-form__field">
        <label>Category</label>
        <!--<el-select v-model="form.category" :options="['Electrical Repair', 'Installation', 'Maintenance', 'Inspection', 'IoT Setup']" placeholder="Select category" />-->
        <el-select
          v-model="form.category"
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
        <el-input-text v-model="form.estimatedDuration" type="number" />
      </div>
    </div>
    <div class="recipe-form__row">
      <div class="recipe-form__field">
        <label>Base Price ($)</label>
        <el-input-text v-model="form.basePrice" type="number" />
      </div>
      <div class="recipe-form__field">
        <el-checkbox v-model="form.requiresIoTCertification" label="Requires IoT Certification" />
      </div>
    </div>
    <div class="recipe-form__field">
      <label>Required Components</label>
      <div v-for="(comp, index) in form.requiredComponents" :key="index" class="recipe-form__comp-row">
        <el-input-text v-model="comp.componentTypeId" placeholder="Component type ID" />
        <el-input-text v-model="comp.quantity" type="number" placeholder="Qty" class="recipe-form__qty" />
        <el-button icon="pi pi-trash" variant="text" severity="danger" @click="removeComponent(index)" />
      </div>
      <el-button label="Add Component" icon="pi pi-plus" variant="text" @click="addComponent" />
    </div>
    <div class="recipe-form__actions">
      <el-button label="Cancel" variant="text" @click="emit('close')" />
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
.recipe-form__comp-row { display: flex; gap: 0.5rem; align-items: center; }
.recipe-form__qty { width: 80px; }
.recipe-form__actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1rem; }
</style>
