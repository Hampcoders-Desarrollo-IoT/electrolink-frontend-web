<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    visible: { type: Boolean, default: false },
    selectedComponentType: { type: Object, default: null }
});

const emit = defineEmits(['save', 'close', 'update:visible']);

const name = ref('');
const description = ref('');

const isEditMode = computed(() => !!props.selectedComponentType);
const modalTitle = computed(() => isEditMode.value ? 'Edit Component Type' : 'New Component Type');
const submitLabel = computed(() => isEditMode.value ? 'Update' : 'Create');
const submitIcon = computed(() => isEditMode.value ? 'pi pi-pencil' : 'pi pi-plus');

watch(() => props.selectedComponentType, (val) => {
    if (val) {
        name.value = val.name;
        description.value = val.description;
    } else {
        resetForm();
    }
}, { immediate: true });

const isValid = computed(() => name.value.trim().length > 0);

function handleSave() {
    if (!isValid.value) return;
    const payload = {
        name: name.value.trim(),
        description: description.value.trim()
    };
    if (isEditMode.value) {
        payload.isActive = props.selectedComponentType?.isActive !== undefined ? props.selectedComponentType.isActive : true;
    }
    emit('save', payload);
}

function handleClose() {
    emit('update:visible', false);
    emit('close');
}

function resetForm() {
    name.value = '';
    description.value = '';
}
</script>

<template>
  <el-dialog
    :visible="visible"
    @update:visible="val => emit('update:visible', val)"
    :header="modalTitle"
    @close="handleClose"
  >
    <div class="ct-modal__body">
      <el-input-text
        v-model="name"
        label="Name"
        placeholder="e.g. Relay, Capacitor, Wiring..."
        class="mb-4"
        autofocus
      />

      <el-textarea
        v-model="description"
        label="Description"
        placeholder="Brief description of this component type..."
        :rows="4"
        class="mb-2"
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
.ct-modal__body {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
}

.mb-4 { margin-bottom: 1.5rem; }
.mb-2 { margin-bottom: 1rem; }
</style>
