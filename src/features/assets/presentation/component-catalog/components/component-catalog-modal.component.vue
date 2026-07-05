<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    visible: { type: Boolean, default: false },
    selectedComponent: { type: Object, default: null }
});

const emit = defineEmits(['save', 'close', 'update:visible']);

const name = ref('');
const description = ref('');
const isActive = ref(true);

const isEditMode = computed(() => !!props.selectedComponent);
const modalTitle = computed(() => isEditMode.value ? 'Edit Component' : 'New Component');
const submitLabel = computed(() => isEditMode.value ? 'Update' : 'Create');
const submitIcon = computed(() => isEditMode.value ? 'pi pi-pencil' : 'pi pi-plus');

watch(() => props.selectedComponent, (val) => {
    if (val) {
        name.value = val.name;
        description.value = val.description;
        isActive.value = val.isActive !== undefined ? val.isActive : true;
    } else {
        resetForm();
    }
}, { immediate: true });

const isValid = computed(() => name.value.trim().length > 0);

function handleSave() {
    if (!isValid.value) return;
    const payload = {
        name: name.value.trim(),
        description: description.value.trim(),
        isActive: isActive.value
    };
    emit('save', payload);
}

function handleClose() {
    emit('update:visible', false);
    emit('close');
}

function resetForm() {
    name.value = '';
    description.value = '';
    isActive.value = true;
}
</script>

<template>
  <el-dialog
    :visible="visible"
    @update:visible="val => emit('update:visible', val)"
    :header="modalTitle"
    @close="handleClose"
  >
    <div class="cc-modal__body">
      <el-input-text
        v-model="name"
        label="Name"
        placeholder="e.g. Relay Switch X-400, Copper Wiring..."
        required
        class="mb-4"
      />

      <el-textarea
        v-model="description"
        label="Description"
        placeholder="Brief description of this component..."
        :rows="3"
        class="mb-4"
      />

      <el-checkbox
        v-model="isActive"
        label="Component is active"
        description="Active components are visible in the inventory and catalog."
        variant="card"
      />
    </div>

    <template #footer>
      <el-button
        variant="ghost"
        label="Cancel"
        icon="pi pi-times"
        @click="handleClose"
      />
      <el-button
        variant="primary"
        :label="submitLabel"
        :icon="submitIcon"
        @click="handleSave"
        :disabled="!isValid"
      />
    </template>
  </el-dialog>
</template>

<style scoped>
.cc-modal__body {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
}

.mb-4 { margin-bottom: 1.5rem; }
</style>
