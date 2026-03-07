<script setup>
import ElMultiSelect from '../../../../shared/presentation/components/el-multi-select.vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    default: 'Specialties'
  },
  placeholder: {
    type: String,
    default: 'Select your speciality'
  }
});

const emit = defineEmits(['update:modelValue']);

const onUpdate = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="specialties-selector">
    <el-multi-select
      :modelValue="modelValue"
      @update:modelValue="onUpdate"
      :options="options"
      :label="label"
      :placeholder="placeholder"
      :maxSelectedLabels="0"
      selectedItemsLabel="{0} specialities selected"
    />
  </div>
</template>

<style scoped>
.specialties-selector {
  width: 100%;
  display: block;
}
</style>
