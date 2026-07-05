<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    visible: { type: Boolean, default: false },
    selectedComponentType: { type: Object, default: null }
});

const emit = defineEmits(['save', 'close', 'update:visible']);

const isActive = ref(true);

const isEditMode = computed(() => !!props.selectedComponentType);
const modalTitle = computed(() => isEditMode.value ? 'Edit Component Type' : 'New Component Type');
const submitLabel = computed(() => isEditMode.value ? 'Update' : 'Create');
const submitIcon = computed(() => isEditMode.value ? 'pi pi-pencil' : 'pi pi-plus');

watch(() => props.selectedComponentType, (val) => {
    if (val) {
        isActive.value = val.isActive !== undefined ? val.isActive : true;
    } else {
        resetForm();
    }
}, { immediate: true });

const isValid = computed(() => true);

function handleSave() {
    if (!isValid.value) return;
    const payload = {};
    if (isEditMode.value) {
        payload.isActive = isActive.value;
    } else {
        payload.isActive = isActive.value;
    }
    emit('save', payload);
}

function handleClose() {
    emit('update:visible', false);
    emit('close');
}

function resetForm() {
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
    <div class="ct-modal__body">
      <p class="ct-modal__hint" v-if="!isEditMode">
        A new component type will be created with a system-generated ID and activated by default.
      </p>

      <el-checkbox
        v-model="isActive"
        label="Component type is active"
        description="Active component types are available in the catalog and inventory."
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
.ct-modal__body {
  padding-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.ct-modal__hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}
</style>
