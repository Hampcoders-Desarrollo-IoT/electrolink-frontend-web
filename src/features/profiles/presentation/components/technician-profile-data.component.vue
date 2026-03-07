<script setup>
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElMultiSelect from '../../../../shared/presentation/components/el-multi-select.vue';
import ElTextarea from '../../../../shared/presentation/components/el-textarea.vue';
import SpecialtiesSelector from './specialties-selector.component.vue';

const props = defineProps({
  specialties: Array,
  experienceYears: Number,
  aboutMe: String
});

const emit = defineEmits([
  'update:specialties',
  'update:experienceYears',
  'update:aboutMe'
]);

const specialtyOptions = [
  { label: 'Solar Installation', value: 0 },
  { label: 'Electrical Maintenance', value: 1 },
  { label: 'Repair', value: 2 },
  { label: 'Inspection', value: 3 },
  { label: 'Upgrade', value: 4 },
  { label: 'Battery Systems', value: 5 }
];
</script>

<template>
  <div class="technician-profile-data">
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-briefcase" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Professional Experience</h4>
      </div>
      
      <div class="form-grid">
        <specialties-selector
          :modelValue="specialties"
          @update:modelValue="emit('update:specialties', $event)"
          :options="specialtyOptions"
          label="Specialties"
          placeholder="Select your specialities"
        />
        
        <el-input-text
          :modelValue="experienceYears"
          @update:modelValue="emit('update:experienceYears', Number($event))"
          label="Years of Experience"
          placeholder="e.g. 5"
          type="number"
        />
      </div>
    </div>

    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-info-circle" style="color: var(--el-custom)"></i>
        <h4 class="group-label">About You</h4>
      </div>
      
      <el-textarea
        :modelValue="aboutMe"
        @update:modelValue="emit('update:aboutMe', $event)"
        label="Professional Bio"
        placeholder="Briefly describe your professional background and skills..."
        :rows="10"
      />
    </div>
  </div>
</template>

<style scoped>
.technician-profile-data {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.data-group {
  background-color: #FEFFFE ;
  border-radius: 12px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.group-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
