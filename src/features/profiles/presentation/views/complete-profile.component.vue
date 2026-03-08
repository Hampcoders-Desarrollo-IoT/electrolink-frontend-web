<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfilesStore } from '../../application/profiles.store.js';

// Atomic Components
import ElSwitcher from '../../../../shared/presentation/components/el-switcher.vue';
import ElButton from '../../../../shared/presentation/components/el-button.vue';

// Business Components
import RoleSelector from '../components/role-selector.component.vue';
import SharedProfileData from '../components/shared-profile-data.component.vue';
import HomeownerProfileData from '../components/homeowner-profile-data.component.vue';
import TechnicianProfileData from '../components/technician-profile-data.component.vue';

const route = useRoute();
const router = useRouter();
const profilesStore = useProfilesStore();

const role = ref(route.query.role?.toUpperCase() || 'TECHNICIAN');
// roleOptions is no longer needed but kept for potential legacy if refactored later
const roleOptions = [
  { label: 'Homeowner', value: 'HOMEOWNER' },
  { label: 'Technician', value: 'TECHNICIAN' }
];

const formData = reactive({
  firstName: '',
  lastName: '',
  dni: '',
  dateOfBirth: null,
  phone: '',
  street: '',
  district: '',
  city: '',
  country: '',
  postalCode: '',
  // Homeowner specific
  preferredContactTime: 0,
  smsNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  emergencyContact: {
    name: '',
    relationship: '',
    phoneNumber: ''
  },
  // Technician specific
  specialties: [],
  experienceYears: 0,
  aboutMe: ''
});

const isSubmitting = ref(false);

const saveProfile = async () => {
  isSubmitting.value = true;
  try {
    const payload = { ...formData, role: role.value };
    // Handle role-specific command creation inside the store or helper
    const success = await profilesStore.createProfileV2(payload);
    if (success) {
      router.push('/profiles/management');
    }
  } catch (error) {
    console.error('Error creating profile:', error);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  if (route.query.role) {
    const qRole = route.query.role.toString().toUpperCase();
    if (['HOMEOWNER', 'TECHNICIAN'].includes(qRole)) {
      role.value = qRole;
    }
  }
});
</script>

<template>
  <div class="complete-profile-view">
    <div class="completion-container">
      <header class="completion-header">
        <h2 class="title">Finalize Your Registration</h2>
        <p class="subtitle">Complete your profile to start using ElectroLink.</p>
      </header>

      <!-- The Unified Profile Board -->
      <main class="profile-board">
        <!-- Left Column: Shared Information -->
        <section class="board-column column-left">
          <shared-profile-data
            v-model:firstName="formData.firstName"
            v-model:lastName="formData.lastName"
            v-model:dni="formData.dni"
            v-model:dateOfBirth="formData.dateOfBirth"
            v-model:phone="formData.phone"
            v-model:street="formData.street"
            v-model:district="formData.district"
            v-model:city="formData.city"
            v-model:country="formData.country"
            v-model:postalCode="formData.postalCode"
          />
        </section>

        <!-- Vertical Divider (Desktop) -->
        <div class="board-divider"></div>

        <!-- Right Column: Role Specific Information -->
        <section class="board-column column-right">
          <div class="role-selector-section">
            <role-selector
              v-model="role"
              label="Select your role"
            />
          </div>

          <div class="role-specific-content">
            <homeowner-profile-data
              v-if="role === 'HOMEOWNER'"
              v-model:preferredContactTime="formData.preferredContactTime"
              v-model:smsNotifications="formData.smsNotifications"
              v-model:emailNotifications="formData.emailNotifications"
              v-model:pushNotifications="formData.pushNotifications"
              v-model:emergencyContact="formData.emergencyContact"
            />

            <technician-profile-data
              v-if="role === 'TECHNICIAN'"
              v-model:specialties="formData.specialties"
              v-model:experienceYears="formData.experienceYears"
              v-model:aboutMe="formData.aboutMe"
            />
          </div>

          <div class="actions-section">
            <el-button
              label="Complete Registration"
              icon="pi pi-check"
              variant="primary"
              :loading="isSubmitting"
              class="w-full h-14"
              @click="saveProfile"
            />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.complete-profile-view {
  min-height: 100vh;
  background-color: var(--el-bg-soft);
  padding: 2rem 1.5rem;
}

.completion-container {
  max-width: 1000px;
  margin: 0 auto;
}

.completion-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--el-primary);
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1rem;
  color: var(--el-gray);
}

/* Board Styling */
.profile-board {
  background-color: #FEFFFE;
  border-radius: 20px;
  border: 1px solid rgba(169, 177, 186, 0.2);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  overflow: hidden;
}

@media (min-width: 1024px) {
  .profile-board {
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  }
}

.board-column {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}

.column-left {
  background-color: transparent;
}

.column-right {
  background-color: transparent;
}

.board-divider {
  width: 1px;
  background: rgba(169, 177, 186, 0.1);
  align-self: stretch;
  display: none;
}

@media (min-width: 1024px) {
  .board-divider {
    display: block;
  }
}

.role-selector-section {
  background-color: transparent;
}

.role-specific-content {
  flex: 1;
}

.actions-section {
  padding-top: 1.5rem;
  margin-top: auto;
}

.w-full {
  width: 100%;
}

.h-14 {
  height: 3.5rem;
}
</style>
