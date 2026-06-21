<script setup>
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElSelect from '../../../../shared/presentation/components/el-select.vue';

const props = defineProps({
  companyName: String,
  taxId: String,
  industry: String,
  companySize: String,
  website: String,
  billingStreet: String,
  billingNumber: String,
  billingDistrict: String,
  billingCity: String,
  billingCountry: String,
  billingPostalCode: String
});

const emit = defineEmits([
  'update:companyName',
  'update:taxId',
  'update:industry',
  'update:companySize',
  'update:website',
  'update:billingStreet',
  'update:billingNumber',
  'update:billingDistrict',
  'update:billingCity',
  'update:billingCountry',
  'update:billingPostalCode'
]);

const companySizeOptions = [
  { label: 'Small (1-50)', value: 'Small' },
  { label: 'Medium (51-200)', value: 'Medium' },
  { label: 'Large (200+)', value: 'Large' }
];
</script>

<template>
  <div class="company-profile-data">
    <!-- Company Information -->
    <div class="data-group">
      <div class="form-grid">
        <el-input-text
          :modelValue="companyName"
          @update:modelValue="emit('update:companyName', $event)"
          label="Company Name"
          placeholder="e.g. TechCorp S.A.C."
          required
        />
        <el-input-text
          :modelValue="taxId"
          @update:modelValue="emit('update:taxId', $event)"
          label="Tax ID / RUC"
          placeholder="e.g. 20123456789"
          required
        />
        <el-input-text
          :modelValue="industry"
          @update:modelValue="emit('update:industry', $event)"
          label="Industry"
          placeholder="e.g. Technology"
        />
        <el-select
          :modelValue="companySize"
          @update:modelValue="emit('update:companySize', $event)"
          :options="companySizeOptions"
          label="Company Size"
          placeholder="Select size"
          required
        />
        <el-input-text
          :modelValue="website"
          @update:modelValue="emit('update:website', $event)"
          label="Website"
          placeholder="https://techcorp.com"
          class="col-span-full"
        />
      </div>
    </div>

    <!-- Billing Address -->
    <div class="data-group">
      <div class="group-header">
        <i class="pi pi-map-marker" style="color: var(--el-custom)"></i>
        <h4 class="group-label">Billing Address</h4>
      </div>
      <div class="form-grid">
        <el-input-text
          :modelValue="billingStreet"
          @update:modelValue="emit('update:billingStreet', $event)"
          label="Street Address"
          placeholder="e.g. Av. Principal"
          required
        />
        <el-input-text
          :modelValue="billingNumber"
          @update:modelValue="emit('update:billingNumber', $event)"
          label="Number"
          placeholder="e.g. 456"
          required
        />
        <el-input-text
          :modelValue="billingDistrict"
          @update:modelValue="emit('update:billingDistrict', $event)"
          label="District"
          placeholder="e.g. San Isidro"
          required
        />
        <el-input-text
          :modelValue="billingCity"
          @update:modelValue="emit('update:billingCity', $event)"
          label="City"
          placeholder="e.g. Lima"
          required
        />
        <el-input-text
          :modelValue="billingCountry"
          @update:modelValue="emit('update:billingCountry', $event)"
          label="Country"
          placeholder="e.g. Perú"
          required
        />
        <el-input-text
          :modelValue="billingPostalCode"
          @update:modelValue="emit('update:billingPostalCode', $event)"
          label="Postal Code"
          placeholder="e.g. 15076"
          required
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.company-profile-data {
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

.col-span-full {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .col-span-full {
    grid-column: span 2;
  }
}
</style>
