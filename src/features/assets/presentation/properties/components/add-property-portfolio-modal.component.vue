<script setup>
import { ref, computed, watch } from 'vue';
import { usePropertyStore } from '../../../application/property.store.js';
import { usePropertyPortfolioStore } from '../../../application/property-portfolio.store.js';
import ElInputText from '@/shared/presentation/components/el-input-text.vue';
import ElButton from '@/shared/presentation/components/el-button.vue';
import ElSelect from '@/shared/presentation/components/el-select.vue';

const props = defineProps({
    modelValue:  { type: Boolean, required: true },
    homeownerId: { type: String,  required: true }
});

const emit = defineEmits(['update:modelValue', 'save', 'cancel']);

const propertiesStore = usePropertyStore();
const portfolioStore = usePropertyPortfolioStore();

const selectedPropertyId = ref('');
const nickname = ref('');
const isPrimary = ref(false);
const occupancyStatus = ref('Vacant');

const occupancyOptions = [
    { label: 'Owner Occupied', value: 'OwnerOccupied' },
    { label: 'Rented', value: 'Rented' },
    { label: 'Vacant', value: 'Vacant' },
    { label: 'Under Renovation', value: 'UnderRenovation' }
];

// Available properties to add (those not already in the portfolio)
const availableProperties = computed(() => {
    const portfolioEntries = portfolioStore.portfolio?.entries || [];
    const inPortfolioIds = portfolioEntries.map(e => e.propertyId);
    
    return propertiesStore.properties
        .filter(p => !inPortfolioIds.includes(p.id))
        .map(p => ({
            label: `${p.address?.street} ${p.address?.number}, ${p.address?.city}`,
            value: p.id,
            original: p
        }));
});

// Auto-suggest a nickname when a property is selected
watch(selectedPropertyId, (newId) => {
    if (newId) {
        const prop = availableProperties.value.find(p => p.value === newId)?.original;
        if (prop && !nickname.value) {
            nickname.value = `${prop.address?.street} ${prop.address?.number}`;
        }
    }
});

const isFormValid = computed(() => {
    return selectedPropertyId.value && nickname.value.trim() !== '';
});

async function onSubmit() {
    if (!isFormValid.value) return;

    const command = {
        propertyId: selectedPropertyId.value,
        nickname: nickname.value.trim(),
        isPrimary: isPrimary.value,
        occupancyStatus: occupancyStatus.value
    };

    const result = await portfolioStore.addPropertyToPortfolio(props.homeownerId, command);
    if (result) {
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
    selectedPropertyId.value = '';
    nickname.value = '';
    isPrimary.value = false;
    occupancyStatus.value = 'Vacant';
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
              <h2 class="modal-title">Add Property to Portfolio</h2>
              <p class="modal-subtitle">Select an existing property to track in your portfolio.</p>
            </div>
            <button class="close-btn" @click="closeModal">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="modal-body">
            <div class="form-fields">
              <div class="form-group">
                <label>Select Property</label>
                <el-select
                  v-model="selectedPropertyId"
                  :options="availableProperties"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Choose a property..."
                />
                <small v-if="availableProperties.length === 0" class="empty-hint">
                    No available properties to add.
                </small>
              </div>

              <div class="form-group">
                <label>Nickname</label>
                <el-input-text v-model="nickname" placeholder="e.g. Primary Residence" />
              </div>

              <div class="row">
                <div class="form-group">
                  <label>Occupancy Status</label>
                  <el-select
                    v-model="occupancyStatus"
                    :options="occupancyOptions"
                    optionLabel="label"
                    optionValue="value"
                  />
                </div>
                
                <div class="form-group toggle-group">
                  <label>Set as Primary</label>
                  <div class="toggle-container" @click="isPrimary = !isPrimary">
                    <div class="toggle-track" :class="{ 'active': isPrimary }">
                      <div class="toggle-thumb"></div>
                    </div>
                    <span class="toggle-label">{{ isPrimary ? 'Yes' : 'No' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="action-btn cancel" @click="closeModal">Cancel</button>
              <button 
                class="action-btn submit" 
                :disabled="!isFormValid || portfolioStore.isLoading"
                @click="onSubmit"
              >
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Same base modal styles as property-modal */
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
  max-width: 600px;
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
  padding: 2rem;
  background-color: #f8fafc;
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

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.empty-hint {
    color: #f59e0b;
    font-size: 0.75rem;
    margin-top: 0.25rem;
}

/* Toggle Switch */
.toggle-group {
    justify-content: flex-start;
}

.toggle-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    margin-top: 0.25rem;
}

.toggle-track {
    width: 2.75rem;
    height: 1.5rem;
    background-color: #cbd5e1;
    border-radius: 9999px;
    position: relative;
    transition: background-color 0.2s;
}

.toggle-track.active {
    background-color: #10b981;
}

.toggle-thumb {
    position: absolute;
    top: 0.125rem;
    left: 0.125rem;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #ffffff;
    border-radius: 50%;
    transition: transform 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.toggle-track.active .toggle-thumb {
    transform: translateX(1.25rem);
}

.toggle-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #475569;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Dark Mode Support */
.dark .modal-container { background-color: #0f172a; border-color: #334155; }
.dark .modal-header { background-color: #0f172a; border-color: #1e293b; }
.dark .modal-title { color: #f1f5f9; }
.dark .modal-body { background-color: #020617; }
.dark label { color: #94a3b8; }
.dark .toggle-track { background-color: #334155; }
.dark .toggle-label { color: #94a3b8; }
.dark .modal-actions { border-color: #1e293b; }
.dark .action-btn.cancel { color: #94a3b8; }
.dark .action-btn.cancel:hover { background-color: #1e293b; color: #f1f5f9; }
</style>
