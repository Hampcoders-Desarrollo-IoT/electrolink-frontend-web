<script setup>
import { ref } from 'vue';
import { usePropertiesStore } from '../../../application/properties.store.js';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const propertiesStore = usePropertiesStore();
const router = useRouter();
const toast = useToast();

const propertyName = ref('');
const street = ref('');
const number = ref('');
const city = ref(null);
const postalCode = ref('');
const latitude = ref('');
const longitude = ref('');

const cityOptions = [
    { label: 'Lima', value: 'Lima' },
    { label: 'San Francisco', value: 'San Francisco' },
    { label: 'Palo Alto', value: 'Palo Alto' },
    { label: 'San Jose', value: 'San Jose' },
    { label: 'Berkeley', value: 'Berkeley' }
];

function onMapClick(coords) {
    latitude.value = coords.lat.toFixed(4);
    longitude.value = coords.lng.toFixed(4);
}

async function onSubmit() {
    const result = await propertiesStore.createProperty({
        name: propertyName.value,
        street: street.value,
        number: number.value,
        city: city.value,
        postalCode: postalCode.value,
        latitude: parseFloat(latitude.value),
        longitude: parseFloat(longitude.value)
    });

    if (result) {
        toast.add({
            severity: 'success',
            summary: 'Property Added',
            detail: `${propertyName.value} has been added successfully.`,
            life: 3000
        });
        router.push({ name: 'assets-properties' });
    }
}

function onCancel() {
    router.back();
}
</script>

<template>
  <div class="property-form">
    <pv-toast />

    <!-- Breadcrumbs -->
    <div class="property-form__breadcrumb">
      <router-link :to="{ name: 'assets-properties' }" class="property-form__breadcrumb-link">Properties</router-link>
      <span class="property-form__breadcrumb-separator">›</span>
      <span class="property-form__breadcrumb-current">Add New Property</span>
    </div>

    <h1 class="property-form__title">Property Details</h1>
    <p class="property-form__subtitle">Configure your charging location and address information.</p>

    <!-- Form Content: 2 columns -->
    <div class="property-form__content">
      <!-- Left Column: Address Information -->
      <div class="property-form__address">
        <div class="property-form__section-header">
          <i class="pi pi-map-marker property-form__section-icon"></i>
          <h2 class="property-form__section-title">Address Information</h2>
        </div>

        <div class="property-form__fields">
          <el-input-text
            v-model="propertyName"
            label="Property Name"
            placeholder="e.g. Property Name"
            required
          />

          <div class="property-form__row">
            <el-input-text
              v-model="street"
              label="Street"
              placeholder="e.g. Innovation Drive"
            />
            <el-input-text
              v-model="number"
              label="Number"
              placeholder="42"
              style="max-width: 120px;"
            />
          </div>

          <div class="property-form__row">
            <el-select
              v-model="city"
              :options="cityOptions"
              optionLabel="label"
              optionValue="value"
              label="City"
              placeholder="Select a city"
            />
            <el-input-text
              v-model="postalCode"
              label="Postal Code"
              placeholder="10115"
              style="max-width: 140px;"
            />
          </div>

          <div class="property-form__row">
            <el-input-text
              v-model="latitude"
              label="Latitude"
              placeholder="52.5200"
              icon="pi pi-compass"
            />
            <el-input-text
              v-model="longitude"
              label="Longitude"
              placeholder="13.4050"
              icon="pi pi-compass"
            />
          </div>
        </div>
      </div>

      <!-- Right Column: Map Location -->
      <div class="property-form__map-section">
        <div class="property-form__map-header">
          <h2 class="property-form__section-title">Map Location</h2>
          <pv-tag value="LIVE PICKER" severity="success" icon="pi pi-circle-fill" />
        </div>

        <div class="property-form__map-container">
          <div class="property-form__map-placeholder">
            <i class="pi pi-map" style="font-size: 3rem; color: var(--el-warm-gray);"></i>
            <p style="color: var(--el-warm-gray); margin-top: 0.75rem; font-size: 0.85rem;">
              Click on the map to set coordinates
            </p>
          </div>
        </div>

        <pv-message severity="info" :closable="false" class="property-form__map-note">
          <i class="pi pi-info-circle"></i>
          Drag the pin or click anywhere on the map to automatically update the Latitude and Longitude fields on the form.
        </pv-message>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="property-form__actions">
      <el-button variant="ghost" label="Cancel" @click="onCancel" />
      <el-button
        variant="primary"
        label="Add Property"
        icon="pi pi-check"
        @click="onSubmit"
        :disabled="!propertyName || !street || !city"
        :loading="propertiesStore.isLoading"
      />
    </div>
  </div>
</template>

<style scoped>
.property-form {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.property-form__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
}

.property-form__breadcrumb-link {
  color: var(--el-primary);
  text-decoration: none;
  font-weight: 500;
}

.property-form__breadcrumb-link:hover {
  text-decoration: underline;
}

.property-form__breadcrumb-separator {
  color: var(--el-warm-gray);
}

.property-form__breadcrumb-current {
  color: var(--el-warm-gray);
}

.property-form__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.property-form__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 1.5rem;
}

.property-form__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.property-form__section-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.property-form__section-icon {
  color: var(--el-primary);
  font-size: 1.1rem;
  background: rgba(46, 58, 89, 0.08);
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-form__section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.property-form__fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.property-form__row {
  display: flex;
  gap: 1rem;
}

.property-form__map-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.property-form__map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-form__map-container {
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--el-bg-soft);
  border: 1px solid rgba(169, 177, 186, 0.2);
}

.property-form__map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 50% 50%, var(--el-bg-soft) 0%, #cbd5e1 100%);
}

.property-form__map-note {
  margin: 0;
}

.property-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .property-form__content {
    grid-template-columns: 1fr;
  }

  .property-form__row {
    flex-direction: column;
  }
}
</style>
