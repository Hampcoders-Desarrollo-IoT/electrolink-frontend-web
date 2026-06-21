<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProfilesStore } from '../../application/profiles.store.js';

import ElButton from '../../../../shared/presentation/components/el-button.vue';

import RoleSelector from '../components/role-selector.component.vue';
import SharedProfileData from '../components/shared-profile-data.component.vue';
import HomeownerProfileData from '../components/homeowner-profile-data.component.vue';
import TechnicianProfileData from '../components/technician-profile-data.component.vue';
import CompanyProfileData from '../components/company-profile-data.component.vue';

const route = useRoute();
const router = useRouter();
const profilesStore = useProfilesStore();

const role = ref(route.query.role?.toUpperCase() || 'TECHNICIAN');

const roleSpecificTitle = computed(() => {
  switch (role.value) {
    case 'HOMEOWNER': return 'Service Preferences';
    case 'TECHNICIAN': return 'Professional Profile';
    case 'COMPANY': return 'Company Details';
    default: return '';
  }
});

const roleSpecificIcon = computed(() => {
  switch (role.value) {
    case 'HOMEOWNER': return 'pi pi-clock';
    case 'TECHNICIAN': return 'pi pi-briefcase';
    case 'COMPANY': return 'pi pi-building';
    default: return 'pi pi-user';
  }
});

const formData = reactive({
  firstName: '',
  lastName: '',
  dni: '',
  dateOfBirth: null,
  phone: '',
  street: '',
  number: '',
  district: '',
  city: '',
  country: '',
  postalCode: '',
  // Homeowner specific
  preferredContactTime: 'Morning',
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
<<<<<<< Updated upstream
  aboutMe: ''
=======
  aboutMe: '',
  centerLatitude: -12.0464,
  centerLongitude: -77.0428,
  radiusKm: 50,
  // Company specific
  companyName: '',
  taxId: '',
  industry: '',
  companySize: '',
  website: '',
  billingStreet: '',
  billingNumber: '',
  billingDistrict: '',
  billingCity: '',
  billingCountry: '',
  billingPostalCode: ''
>>>>>>> Stashed changes
});

const isSubmitting = ref(false);

const saveProfile = async () => {
  isSubmitting.value = true;
  try {
    const payload = { ...formData, role: role.value };
    // Handle role-specific command creation inside the store or helper
    const success = await profilesStore.createProfileV2(payload);
    if (success) {
      router.push('/dashboard');
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
    if (['HOMEOWNER', 'TECHNICIAN', 'COMPANY'].includes(qRole)) {
      role.value = qRole;
    }
  }
<<<<<<< Updated upstream
=======

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      formData.centerLatitude = position.coords.latitude;
      formData.centerLongitude = position.coords.longitude;
    }, (error) => {
      console.warn('Geolocation failed or denied:', error.message);
    });
  }
>>>>>>> Stashed changes
});
</script>

<template>
  <div class="complete-profile-view">
    <div class="completion-container">
      <header class="completion-header">
        <h2 class="title">Finalize Your Registration</h2>
        <p class="subtitle">Complete your profile to start using ElectroLink.</p>
      </header>

      <main class="profile-form">
        <!-- Personal Information -->
        <section class="form-section">
          <div class="section-header">
            <i class="pi pi-user section-header-icon"></i>
            <h3 class="section-header-title">Personal Information</h3>
          </div>
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

<<<<<<< Updated upstream
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
=======
        <!-- Role Selector -->
        <section class="form-section role-section">
          <role-selector
            v-model="role"
            label="Select your role"
          />
>>>>>>> Stashed changes
        </section>

        <!-- Role-Specific Section -->
        <section class="form-section">
          <div class="section-header">
            <i :class="[roleSpecificIcon, 'section-header-icon']"></i>
            <h3 class="section-header-title">{{ roleSpecificTitle }}</h3>
            <pv-tag :value="role" severity="info" class="role-tag" />
          </div>

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
            v-model:centerLatitude="formData.centerLatitude"
            v-model:centerLongitude="formData.centerLongitude"
            v-model:radiusKm="formData.radiusKm"
            :errors="validationErrors"
          />

          <company-profile-data
            v-if="role === 'COMPANY'"
            v-model:companyName="formData.companyName"
            v-model:taxId="formData.taxId"
            v-model:industry="formData.industry"
            v-model:companySize="formData.companySize"
            v-model:website="formData.website"
            v-model:billingStreet="formData.billingStreet"
            v-model:billingNumber="formData.billingNumber"
            v-model:billingDistrict="formData.billingDistrict"
            v-model:billingCity="formData.billingCity"
            v-model:billingCountry="formData.billingCountry"
            v-model:billingPostalCode="formData.billingPostalCode"
          />
        </section>

        <!-- Submit -->
        <div class="actions-section">
          <el-button
            label="Complete Registration"
            icon="pi pi-check"
            variant="primary"
            :loading="isSubmitting"
            class="submit-button"
            @click="saveProfile"
          />
        </div>
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
  max-width: 720px;
  margin: 0 auto;
<<<<<<< Updated upstream
=======
  padding: 1rem 1.5rem 3rem;
>>>>>>> Stashed changes
}

.completion-header {
  text-align: center;
  margin-bottom: 2rem;
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

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background-color: #FEFFFE;
  border-radius: 16px;
  border: 1px solid rgba(169, 177, 186, 0.15);
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(169, 177, 186, 0.1);
}

.section-header-icon {
  font-size: 1.25rem;
  color: var(--el-custom);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-soft);
  border-radius: 8px;
}

.section-header-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
  flex-grow: 1;
}

.role-tag {
  font-size: 0.65rem;
}

.role-section {
  background-color: #FEFFFE;
  text-align: center;
}

.role-section :deep(.role-btn-group) {
  max-width: 400px;
  margin: 0 auto;
}

.actions-section {
  padding-top: 0.5rem;
}

.submit-button {
  width: 100%;
  height: 3.5rem;
  font-size: 1.05rem;
}
</style>
