<script setup>
import { computed } from 'vue';
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElMultiSelect from '../../../../shared/presentation/components/el-multi-select.vue';
import ElTextarea from '../../../../shared/presentation/components/el-textarea.vue';
import ElMap from '../../../../shared/presentation/components/el-map.vue';
import SpecialtiesSelector from './specialties-selector.component.vue';

const props = defineProps({
  specialties: Array,
  experienceYears: Number,
  aboutMe: String,
  centerLatitude: Number,
  centerLongitude: Number,
  radiusKm: Number,
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:specialties',
  'update:experienceYears',
  'update:aboutMe',
  'update:centerLatitude',
  'update:centerLongitude',
  'update:radiusKm'
]);

const specialtyOptions = [
  { label: 'Solar Installation', value: 'SolarInstallation' },
  { label: 'Electrical Maintenance', value: 'ElectricalMaintenance' },
  { label: 'Repair', value: 'Repair' },
  { label: 'Inspection', value: 'Inspection' },
  { label: 'Upgrade', value: 'Upgrade' },
  { label: 'Battery Systems', value: 'BatterySystems' }
];

const circleData = computed(() => {
  if (props.centerLatitude && props.centerLongitude && props.radiusKm) {
    return {
      center: [props.centerLatitude, props.centerLongitude],
      radiusKm: props.radiusKm
    };
  }
  return null;
});

const onMapClick = (coords) => {
  emit('update:centerLatitude', coords.lat);
  emit('update:centerLongitude', coords.lng);
};
</script>

<template>
  <div class="technician-profile-data">
    <div class="data-group">
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
        <i class="pi pi-map-marker" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Service Area</h4>
      </div>
      
      <div class="map-container" style="height: 300px; margin-bottom: 1rem; border-radius: 8px; overflow: hidden;">
        <el-map
          :center="[centerLatitude || -12.0464, centerLongitude || -77.0428]"
          :zoom="10"
          :clickable="true"
          :circle="circleData"
          @map-click="onMapClick"
        />
      </div>

      <div class="form-grid">
        <el-input-text
          :modelValue="centerLatitude"
          @update:modelValue="emit('update:centerLatitude', Number($event))"
          label="Latitude"
          readonly
          :error="errors.centerLatitude ? $t(errors.centerLatitude) : ''"
        />
        <el-input-text
          :modelValue="centerLongitude"
          @update:modelValue="emit('update:centerLongitude', Number($event))"
          label="Longitude"
          readonly
          :error="errors.centerLongitude ? $t(errors.centerLongitude) : ''"
        />
      </div>

      <div class="slider-group" style="margin-top: 1rem;">
        <label class="el-input-label">Service Radius: {{ radiusKm }} km</label>
        <input
          type="range"
          min="1"
          max="100"
          :value="radiusKm"
          @input="emit('update:radiusKm', Number($event.target.value))"
          class="el-slider"
          style="width: 100%;"
        />
        <small v-if="errors.radiusKm" class="el-input-error-msg">{{ $t(errors.radiusKm) }}</small>

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

.el-input-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2E3A59;
}

.el-input-error-msg {
  color: var(--el-danger);
  font-size: 0.75rem;
  margin-top: 0.125rem;
  font-weight: 500;
}

.el-slider {
  accent-color: var(--el-custom);
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
