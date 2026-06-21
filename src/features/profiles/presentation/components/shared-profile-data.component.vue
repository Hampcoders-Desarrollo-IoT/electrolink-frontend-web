<script setup>
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElDatepicker from '../../../../shared/presentation/components/el-datepicker.vue';

const props = defineProps({
  firstName: String,
  lastName: String,
  dni: String,
  dateOfBirth: [String, Date],
  phone: String,
  street: String,
  district: String,
  city: String,
  country: String,
  postalCode: String
});

const emit = defineEmits([
  'update:firstName',
  'update:lastName',
  'update:dni',
  'update:dateOfBirth',
  'update:phone',
  'update:street',
  'update:number',
  'update:district',
  'update:city',
  'update:country',
  'update:postalCode'
]);
</script>

<template>
  <div class="shared-profile-data">
    <!-- Personal Information -->
    <div class="data-group">
      <div class="form-grid">
        <el-input-text
          :modelValue="firstName"
          @update:modelValue="emit('update:firstName', $event)"
          label="First Name"
          placeholder="e.g. Alex"
          required
        />
        <el-input-text
          :modelValue="lastName"
          @update:modelValue="emit('update:lastName', $event)"
          label="Last Name"
          placeholder="e.g. Thompson"
          required
        />
        <el-input-text
          :modelValue="dni"
          @update:modelValue="emit('update:dni', $event)"
          label="DNI / Identification"
          placeholder="8-digit number"
          required
        />
        <el-datepicker
          :modelValue="dateOfBirth"
          @update:modelValue="emit('update:dateOfBirth', $event)"
          label="Date of Birth"
          placeholder="Select your birthday"
          required
        />
        <el-input-text
          :modelValue="phone"
          @update:modelValue="emit('update:phone', $event)"
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          icon="pi pi-phone"
          required
        />
      </div>
    </div>

    <!-- Address Information -->
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-map-marker" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Address Information</h4>
      </div>
      <div class="form-grid">
        <el-input-text
          :modelValue="street"
          @update:modelValue="emit('update:street', $event)"
          label="Street Address"
          placeholder="e.g. Av. Javier Prado"
        />
        <el-input-text
          :modelValue="district"
          @update:modelValue="emit('update:district', $event)"
          label="District"
          placeholder="e.g. San Isidro"
        />
        <el-input-text
          :modelValue="city"
          @update:modelValue="emit('update:city', $event)"
          label="City"
          placeholder="e.g. Lima"
        />
        <el-input-text
          :modelValue="country"
          @update:modelValue="emit('update:country', $event)"
          label="Country"
          placeholder="e.g. Peru"
        />
        <el-input-text
          :modelValue="postalCode"
          @update:modelValue="emit('update:postalCode', $event)"
          label="Postal Code"
          placeholder="e.g. 15046"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.shared-profile-data {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.data-group {
  background-color: #FEFFFE;
  border-radius: 12px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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
    grid-template-columns: 1fr 1fr;
  }
}
</style>
