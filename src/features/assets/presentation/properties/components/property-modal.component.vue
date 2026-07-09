<script setup>
import { ref, computed, watch } from 'vue';
import { usePropertyStore } from '../../../application/property.store.js';
import { usePropertyPortfolioStore } from '../../../application/property-portfolio.store.js';
import ElInputText from '@/shared/presentation/components/el-input-text.vue';
import ElButton from '@/shared/presentation/components/el-button.vue';
import ElMap from '@/shared/presentation/components/el-map.vue';
import ElSelect from '@/shared/presentation/components/el-select.vue';

const props = defineProps({
    modelValue:  { type: Boolean, required: true },
    homeownerId: { type: String,  required: true },
    context:     { type: String,  default: 'homeowner' }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const propertiesStore = usePropertyStore();
const portfolioStore = usePropertyPortfolioStore();

// Form fields
const street       = ref('');
const number       = ref('');
const district     = ref('');
const city         = ref('Lima');
const country      = ref('Perú');
const postalCode   = ref('');
const latitude     = ref('');
const longitude    = ref('');
const accuracy     = ref(null);
const source       = ref('GPS');
const propertyType = ref('RESIDENTIAL');

const cityOptions = [
    { label: 'Select a city', value: '' },
    { label: 'Lima', value: 'Lima' },
    { label: 'Arequipa', value: 'Arequipa' },
    { label: 'Cusco', value: 'Cusco' },
    { label: 'Trujillo', value: 'Trujillo' }
];

const propertyTypeOptions = [
    { label: 'Residential', value: 'RESIDENTIAL' },
    { label: 'Commercial', value: 'COMMERCIAL' },
    { label: 'Building', value: 'BUILDING' }
];

// Map state
const mapCenter = computed(() => {
    if (latitude.value && longitude.value) {
        return [parseFloat(latitude.value), parseFloat(longitude.value)];
    }
    return [-12.0464, -77.0428];
});

const clickMarkerList = computed(() => {
    if (!latitude.value || !longitude.value) return [];
    return [{
        lat:   parseFloat(latitude.value),
        lng:   parseFloat(longitude.value),
        popup: 'New Property',
        type:  'property'
    }];
});

function onMapClick({ lat, lng }) {
    latitude.value  = lat.toFixed(6);
    longitude.value = lng.toFixed(6);
}

// Validation
const isFormValid = computed(() =>
    street.value.trim() &&
    number.value.trim() &&
    city.value.trim()
);

async function onSubmit() {
    const command = {
        address: {
            street:     street.value.trim(),
            number:     number.value.trim(),
            district:   district.value.trim(),
            city:       city.value.trim(),
            country:    country.value.trim(),
            postalCode: postalCode.value.trim() || null
        },
        geolocation: {
            latitude:  latitude.value  ? parseFloat(latitude.value)  : 0,
            longitude: longitude.value ? parseFloat(longitude.value) : 0,
            accuracy:  accuracy.value  ? parseInt(accuracy.value)    : null,
            source:    source.value
        },
        propertyType: propertyType.value
    };

    const result = await propertiesStore.createProperty(props.homeownerId, command, props.context);

    if (result) {
        const defaultNickname = street.value.trim() + ' ' + number.value.trim();
        const occupancyStatus = props.context === 'company' ? 'Vacant' : 'VACANT';
        const portfolioCommand = {
            propertyId: result.id || result.propertyId,
            nickname: defaultNickname,
            isPrimary: false,
            occupancyStatus: occupancyStatus
        };
        await portfolioStore.addPropertyToPortfolio(props.homeownerId, portfolioCommand);

        emit('save');
        closeModal();
    }
}

function closeModal() {
    emit('update:modelValue', false);
    emit('cancel');
    resetForm();
}

function resetForm() {
    street.value       = '';
    number.value       = '';
    district.value     = '';
    city.value         = 'Lima';
    country.value      = 'Perú';
    postalCode.value   = '';
    latitude.value     = '';
    longitude.value    = '';
    accuracy.value     = null;
    source.value       = 'GPS';
    propertyType.value = 'RESIDENTIAL';
}

watch(() => props.modelValue, (val) => {
    if (val) resetForm();
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="header-info">
              <div class="breadcrumb">
                <span>Properties</span>
                <span class="material-symbols-outlined separator">chevron_right</span>
                <span class="active">Add New Property</span>
              </div>
              <h2 class="modal-title">Property Details</h2>
              <p class="modal-subtitle">Configure your charging location and address information.</p>
            </div>
            <button class="close-btn" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div class="modal-grid">
              <!-- Address Form -->
              <div class="form-section">
                <h3 class="section-title">
                  <span class="material-symbols-outlined icon">location_on</span>
                  Address Information
                </h3>
                
                <div class="form-fields">
                  <div class="row">
                    <div class="form-group flex-2">
                      <label>Street</label>
                      <el-input-text v-model="street" placeholder="e.g. Innovation Drive" />
                    </div>
                    <div class="form-group flex-1">
                      <label>Number</label>
                      <el-input-text v-model="number" placeholder="42" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>District</label>
                    <el-input-text v-model="district" placeholder="e.g. Miraflores" />
                  </div>

                  <div class="row">
                    <div class="form-group">
                      <label>City</label>
                      <el-select
                        v-model="city"
                        :options="cityOptions"
                        optionLabel="label"
                        optionValue="value"
                      />
                    </div>
                    <div class="form-group">
                      <label>Postal Code</label>
                      <el-input-text v-model="postalCode" placeholder="15074" />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Country</label>
                    <el-input-text v-model="country" placeholder="Perú" />
                  </div>

                  <div class="form-group">
                    <label>Property Type</label>
                    <el-select
                      v-model="propertyType"
                      :options="propertyTypeOptions"
                      optionLabel="label"
                      optionValue="value"
                    />
                  </div>

                  <div class="row">
                    <div class="form-group">
                      <label>Latitude</label>
                      <el-input-text v-model="latitude" disabled class="disabled-input">
                        <template #prefix><span class="material-symbols-outlined">crosshairs</span></template>
                      </el-input-text>
                    </div>
                    <div class="form-group">
                      <label>Longitude</label>
                      <el-input-text v-model="longitude" disabled class="disabled-input">
                        <template #prefix><span class="material-symbols-outlined">crosshairs</span></template>
                      </el-input-text>
                    </div>
                  </div>
                </div>

                <div class="modal-actions">
                  <button class="action-btn cancel" @click="closeModal">Cancel</button>
                  <button 
                    class="action-btn submit" 
                    :disabled="!isFormValid || propertiesStore.isLoading"
                    @click="onSubmit"
                  >
                    Add Property
                  </button>
                </div>
              </div>

              <!-- Map Section -->
              <div class="map-section">
                <div class="section-header">
                  <h3 class="section-title">Map Location</h3>
                  <span class="live-picker">LIVE PICKER</span>
                </div>

                <div class="map-wrapper">
                  <el-map
                    :center="mapCenter"
                    :markers="clickMarkerList"
                    :clickable="true"
                    :zoom="13"
                    height="100%"
                    @map-click="onMapClick"
                  />
                  <div class="map-hint">
                    <span class="material-symbols-outlined">touch_app</span>
                    Click on the map to set coordinates
                  </div>
                </div>

                <div class="info-alert">
                  <span class="material-symbols-outlined info-icon">info</span>
                  <p>Drag the pin or click anywhere on the map to automatically update the Latitude and Longitude fields.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-container {
  background-color: #ffffff;
  width: 100%;
  max-width: 1000px;
  max-height: 90vh;
  border-radius: 1.25rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: #ffffff;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.breadcrumb .separator {
  font-size: 0.875rem;
}

.breadcrumb .active {
  font-weight: 700;
  color: #0f172a;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2E3A59;
  margin: 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: #f1f5f9;
  color: #0f172a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background-color: #f8fafc;
}

.modal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 1024px) {
  .modal-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.section-title .icon {
  color: #F97316;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.row {
  display: flex;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.disabled-input {
  background-color: #f1f5f9 !important;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  padding: 0.625rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.cancel {
  background: none;
  border: none;
  color: #64748b;
}

.action-btn.cancel:hover {
  color: #0f172a;
  background-color: #f1f5f9;
}

.action-btn.submit {
  background-color: #2E3A59;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(46, 58, 89, 0.2);
}

.action-btn.submit:hover {
  background-color: #1e263e;
  transform: translateY(-1px);
}

.action-btn.submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Map Section */
.map-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 0.75rem;
}

.section-header .section-title {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.live-picker {
  font-size: 0.625rem;
  font-weight: 800;
  color: #F97316;
  background-color: #FFF1E5;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
}

.map-wrapper {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  height: 350px;
  position: relative;
  overflow: hidden;
  padding: 0.5rem;
}

.map-hint {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background-color: #2E3A59;
  color: #ffffff;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.info-alert {
  background-color: #FFF1E5;
  border: 1px solid #ffd8b8;
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.info-icon {
  color: #F97316;
  font-size: 1.25rem;
}

.info-alert p {
  font-size: 0.8125rem;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
  font-weight: 500;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-body::-webkit-scrollbar {
  width: 6px;
}

.modal-body::-webkit-scrollbar-track {
  background: transparent;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.dark .modal-container { background-color: #0f172a; border-color: #334155; }
.dark .modal-header { background-color: #0f172a; border-color: #1e293b; }
.dark .modal-title { color: #f1f5f9; }
.dark .modal-body { background-color: #020617; }
.dark .section-title { color: #f1f5f9; border-color: #1e293b; }
.dark label { color: #94a3b8; }
.dark .modal-actions { border-color: #1e293b; }
.dark .action-btn.cancel { color: #94a3b8; }
.dark .action-btn.cancel:hover { background-color: #1e293b; color: #f1f5f9; }
.dark .map-wrapper { background-color: #0f172a; border-color: #1e293b; }
.dark .breadcrumb .active { color: #f1f5f9; }
</style>
