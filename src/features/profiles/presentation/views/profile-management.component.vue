<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProfilesStore } from '../../application/profiles.store.js';
import useIamStore from '../../../iam/application/iam.store.js';
import { UpdatePersonalDataCommand } from '../../domain/commands/update-personal-data.command.js';
import { UpdateTechnicianCommand } from '../../domain/commands/update-technician.command.js';
import { UpdateHomeownerCommand } from '../../domain/commands/update-homeowner.command.js';
import { DeactivateProfileCommand } from '../../domain/commands/deactivate-profile.command.js';

import ElButton from '../../../../shared/presentation/components/el-button.vue';
import ElCheckbox from '../../../../shared/presentation/components/el-checkbox.vue';
import ElInputText from '../../../../shared/presentation/components/el-input-text.vue';
import ElSelect from '../../../../shared/presentation/components/el-select.vue';
import ElTextarea from '../../../../shared/presentation/components/el-textarea.vue';
import ElDialog from '../../../../shared/presentation/components/el-dialog.vue';
import ElChip from '../../../../shared/presentation/components/el-chip.vue';

const router = useRouter();
const profilesStore = useProfilesStore();
const iamStore = useIamStore();

const profile = computed(() => profilesStore.profile);
const isLoading = computed(() => profilesStore.isLoading);

const editingSection = ref(null);
const showDeactivateDialog = ref(false);
const deactivateReason = ref('');
const deactivateNotes = ref('');

const personalDataForm = ref({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  street: '',
  number: '',
  district: '',
  city: '',
  country: '',
  postalCode: ''
});

const technicianForm = ref({
  specialties: [],
  experienceYears: 0,
  aboutMe: '',
  centerLatitude: null,
  centerLongitude: null,
  radiusKm: null
});

const homeownerForm = ref({
  preferredContactTime: 'Morning',
  smsNotifications: false,
  emailNotifications: false,
  pushNotifications: false,
  emergencyContact: null
});

const roleBadge = computed(() => {
  if (!profile.value) return '';
  if (profile.value.isTechnician) return 'Technician';
  if (profile.value.isHomeowner) return 'Homeowner';
  if (profile.value.isCompany) return 'Company';
  return '';
});

const serviceAreaLabel = computed(() => {
  const t = profile.value?.technician;
  if (!t) return null;
  return `${t.centerLatitude?.toFixed(4)}, ${t.centerLongitude?.toFixed(4)} · ${t.radiusKm} km`;
});

function startEdit(section) {
  editingSection.value = section;
  if (section === 'personal') {
    const p = profile.value;
    personalDataForm.value = {
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      phoneNumber: p.phoneNumber || '',
      street: p.street || '',
      number: p.number || '',
      district: p.district || '',
      city: p.city || '',
      country: p.country || '',
      postalCode: p.postalCode || ''
    };
  } else if (section === 'technician' && profile.value.technician) {
    const t = profile.value.technician;
    technicianForm.value = {
      specialties: [...t.specialties],
      experienceYears: t.experienceYears,
      aboutMe: t.aboutMe || '',
      centerLatitude: t.centerLatitude,
      centerLongitude: t.centerLongitude,
      radiusKm: t.radiusKm
    };
  } else if (section === 'homeowner' && profile.value.homeowner) {
    const h = profile.value.homeowner;
    homeownerForm.value = {
      preferredContactTime: h.preferredContactTime || 'Morning',
      smsNotifications: h.smsNotifications,
      emailNotifications: h.emailNotifications,
      pushNotifications: h.pushNotifications,
      emergencyContact: h.emergencyContact ? { ...h.emergencyContact } : null
    };
  }
}

function cancelEdit() {
  editingSection.value = null;
}

async function savePersonalData() {
  const command = new UpdatePersonalDataCommand(personalDataForm.value);
  const success = await profilesStore.updatePersonalData(command);
  if (success) editingSection.value = null;
}

async function saveTechnicianData() {
  const command = new UpdateTechnicianCommand(technicianForm.value);
  const success = await profilesStore.updateTechnicianData(command);
  if (success) editingSection.value = null;
}

async function saveHomeownerData() {
  const command = new UpdateHomeownerCommand(homeownerForm.value);
  const success = await profilesStore.updateHomeownerData(command);
  if (success) editingSection.value = null;
}

async function deactivateProfile() {
  const command = new DeactivateProfileCommand({
    reason: deactivateReason.value,
    notes: deactivateNotes.value
  });
  const success = await profilesStore.deactivateProfile(command);
  if (success) {
    showDeactivateDialog.value = false;
    deactivateReason.value = '';
    deactivateNotes.value = '';
  }
}

async function reactivateProfile() {
  await profilesStore.reactivateProfile();
}

function handleEmergencyContact(field, value) {
  const current = homeownerForm.value.emergencyContact || { name: '', relationship: '', phoneNumber: '' };
  homeownerForm.value.emergencyContact = { ...current, [field]: value };
}

onMounted(async () => {
  if (!profile.value) {
    const userId = iamStore.currentUserId;
    if (userId) {
      await profilesStore.loadProfile(userId);
    }
  }
});
</script>

<template>
  <div class="profile-layout">
    <main class="profile-main">
      <header class="profile-header">
        <div class="header-user">
          <pv-avatar
            v-if="profile?.profilePictureUrl"
            :image="profile.profilePictureUrl"
            shape="circle"
            size="xlarge"
            class="user-avatar"
          />
          <pv-avatar
            v-else
            icon="pi pi-user"
            shape="circle"
            size="xlarge"
            class="user-avatar"
          />
          <div class="user-info">
            <h1 class="user-name">{{ profile?.fullName || 'User' }}</h1>
            <div class="user-meta">
              <pv-tag :value="roleBadge" severity="info" class="role-tag" />
              <span class="user-email">{{ iamStore.currentUsername }}</span>
            </div>
          </div>
        </div>
      </header>

      <div v-if="isLoading" class="loading-state">
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
        <p>Loading profile...</p>
      </div>

      <div v-else-if="profile" class="profile-body">
        <!-- Personal Data Section -->
        <section class="profile-section el-card el-shadow">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-user"></i>
            </div>
            <h2 class="section-title">Personal Data</h2>
            <el-button
              v-if="editingSection !== 'personal'"
              label="Edit"
              icon="pi pi-pencil"
              variant="secondary"
              size="small"
              @click="startEdit('personal')"
            />
          </div>

          <div v-if="editingSection === 'personal'" class="edit-form">
            <div class="form-grid">
              <el-input-text
                v-model="personalDataForm.firstName"
                label="First Name"
              />
              <el-input-text
                v-model="personalDataForm.lastName"
                label="Last Name"
              />
              <el-input-text
                v-model="personalDataForm.phoneNumber"
                label="Phone Number"
              />
              <el-input-text
                v-model="personalDataForm.street"
                label="Street"
              />
              <el-input-text
                v-model="personalDataForm.number"
                label="Number"
              />
              <el-input-text
                v-model="personalDataForm.district"
                label="District"
              />
              <el-input-text
                v-model="personalDataForm.city"
                label="City"
              />
              <el-input-text
                v-model="personalDataForm.country"
                label="Country"
              />
              <el-input-text
                v-model="personalDataForm.postalCode"
                label="Postal Code"
              />
            </div>
            <div class="edit-actions">
              <el-button label="Save" variant="primary" @click="savePersonalData" />
              <el-button label="Cancel" variant="secondary" @click="cancelEdit" />
            </div>
          </div>

          <div v-else class="data-grid">
            <div class="data-item">
              <label class="data-label">Full Name</label>
              <p class="data-value">{{ profile.fullName || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">DNI</label>
              <p class="data-value">{{ profile.dni || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Date of Birth</label>
              <p class="data-value">{{ profile.dateOfBirth || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Phone Number</label>
              <p class="data-value">{{ profile.phoneNumber || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Address</label>
              <p class="data-value">{{ profile.street }} {{ profile.number }}, {{ profile.district }}, {{ profile.city }}, {{ profile.country }} {{ profile.postalCode }}</p>
            </div>
          </div>
        </section>

        <!-- Technician Section -->
        <section v-if="profile.technician" class="profile-section el-card el-shadow">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-briefcase"></i>
            </div>
            <h2 class="section-title">Professional Profile</h2>
            <pv-tag value="TECHNICIAN" severity="info" class="view-tag" />
            <el-button
              v-if="editingSection !== 'technician'"
              label="Edit"
              icon="pi pi-pencil"
              variant="secondary"
              size="small"
              @click="startEdit('technician')"
            />
          </div>

          <div v-if="editingSection === 'technician'" class="edit-form">
            <div class="form-grid">
              <div class="form-group-full">
                <label class="form-label">Specialties</label>
                <div class="specialties-edit">
                  <label v-for="opt in [
                    { label: 'Solar Installation', value: 'SolarInstallation' },
                    { label: 'Electrical Maintenance', value: 'ElectricalMaintenance' },
                    { label: 'Repair', value: 'Repair' },
                    { label: 'Inspection', value: 'Inspection' },
                    { label: 'Upgrade', value: 'Upgrade' },
                    { label: 'Battery Systems', value: 'BatterySystems' }
                  ]" :key="opt.value" class="specialty-checkbox">
                    <input
                      type="checkbox"
                      :value="opt.value"
                      :checked="technicianForm.specialties.includes(opt.value)"
                      @change="(e) => {
                        if (e.target.checked) technicianForm.specialties.push(opt.value);
                        else technicianForm.specialties = technicianForm.specialties.filter(s => s !== opt.value);
                      }"
                    />
                    <span>{{ opt.label }}</span>
                  </label>
                </div>
              </div>
              <el-input-text
                v-model.number="technicianForm.experienceYears"
                label="Years of Experience"
                type="number"
              />
              <div class="form-group-full">
                <el-textarea
                  v-model="technicianForm.aboutMe"
                  label="About Me"
                  :rows="4"
                />
              </div>
              <el-input-text
                v-model.number="technicianForm.centerLatitude"
                label="Center Latitude"
                type="number"
                step="0.0001"
              />
              <el-input-text
                v-model.number="technicianForm.centerLongitude"
                label="Center Longitude"
                type="number"
                step="0.0001"
              />
              <el-input-text
                v-model.number="technicianForm.radiusKm"
                label="Radius (km)"
                type="number"
                min="1"
                max="100"
              />
            </div>
            <div class="edit-actions">
              <el-button label="Save" variant="primary" @click="saveTechnicianData" />
              <el-button label="Cancel" variant="secondary" @click="cancelEdit" />
            </div>
          </div>

          <div v-else class="professional-data">
            <div class="data-item">
              <label class="data-label">Specialties</label>
              <div class="cert-tags">
                <pv-tag
                  v-for="spec in profile.technician.specialties"
                  :key="spec"
                  :value="spec"
                  severity="secondary"
                />
              </div>
            </div>
            <div class="data-item">
              <label class="data-label">Years of Experience</label>
              <p class="data-value">{{ profile.technician.experienceYears }} years</p>
            </div>
            <div class="data-item">
              <label class="data-label">Service Area</label>
              <p class="data-value">{{ serviceAreaLabel || 'Not configured' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">About Me</label>
              <p class="data-value">{{ profile.technician.aboutMe || '-' }}</p>
            </div>
          </div>
        </section>

        <!-- Homeowner Section -->
        <section v-if="profile.homeowner" class="profile-section el-card el-shadow">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-sliders-h"></i>
            </div>
            <h2 class="section-title">Preferences</h2>
            <pv-tag value="HOMEOWNER" severity="info" class="view-tag" />
            <el-button
              v-if="editingSection !== 'homeowner'"
              label="Edit"
              icon="pi pi-pencil"
              variant="secondary"
              size="small"
              @click="startEdit('homeowner')"
            />
          </div>

          <div v-if="editingSection === 'homeowner'" class="edit-form">
            <div class="form-grid">
              <el-select
                v-model="homeownerForm.preferredContactTime"
                :options="[
                  { label: 'Morning (8AM - 12PM)', value: 'Morning' },
                  { label: 'Afternoon (12PM - 4PM)', value: 'Afternoon' },
                  { label: 'Evening (4PM - 8PM)', value: 'Evening' }
                ]"
                label="Preferred Contact Time"
              />
              <div class="notification-edit">
                <label class="form-label">Notifications</label>
                <el-checkbox v-model="homeownerForm.smsNotifications" label="SMS" />
                <el-checkbox v-model="homeownerForm.emailNotifications" label="Email" />
                <el-checkbox v-model="homeownerForm.pushNotifications" label="Push" />
              </div>
              <el-input-text
                :modelValue="homeownerForm.emergencyContact?.name || ''"
                @update:modelValue="handleEmergencyContact('name', $event)"
                label="Emergency Contact Name"
              />
              <el-input-text
                :modelValue="homeownerForm.emergencyContact?.relationship || ''"
                @update:modelValue="handleEmergencyContact('relationship', $event)"
                label="Relationship"
              />
              <el-input-text
                :modelValue="homeownerForm.emergencyContact?.phoneNumber || ''"
                @update:modelValue="handleEmergencyContact('phoneNumber', $event)"
                label="Emergency Phone"
              />
            </div>
            <div class="edit-actions">
              <el-button label="Save" variant="primary" @click="saveHomeownerData" />
              <el-button label="Cancel" variant="secondary" @click="cancelEdit" />
            </div>
          </div>

          <div v-else class="preferences-grid">
            <div class="pref-item">
              <label class="data-label">Preferred Contact Time</label>
              <p class="data-value">{{ profile.homeowner.preferredContactTime || '-' }}</p>
            </div>
            <div class="pref-item">
              <label class="data-label">Notifications</label>
              <div class="pref-badges">
                <pv-tag v-if="profile.homeowner.smsNotifications" value="SMS" severity="success" />
                <pv-tag v-if="profile.homeowner.emailNotifications" value="Email" severity="success" />
                <pv-tag v-if="profile.homeowner.pushNotifications" value="Push" severity="success" />
                <span v-if="!profile.homeowner.smsNotifications && !profile.homeowner.emailNotifications && !profile.homeowner.pushNotifications" class="data-value">None</span>
              </div>
            </div>
            <div v-if="profile.homeowner.emergencyContact" class="pref-item">
              <label class="data-label">Emergency Contact</label>
              <p class="data-value">{{ profile.homeowner.emergencyContact.name }} ({{ profile.homeowner.emergencyContact.relationship }}) — {{ profile.homeowner.emergencyContact.phoneNumber }}</p>
            </div>
          </div>
        </section>

        <!-- Company Section -->
        <section v-if="profile.company" class="profile-section el-card el-shadow">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-building"></i>
            </div>
            <h2 class="section-title">Company Information</h2>
            <pv-tag value="COMPANY" severity="info" class="view-tag" />
          </div>

          <div class="data-grid">
            <div class="data-item">
              <label class="data-label">Company Name</label>
              <p class="data-value">{{ profile.company.companyName || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Tax ID</label>
              <p class="data-value">{{ profile.company.taxId || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Industry</label>
              <p class="data-value">{{ profile.company.industry || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Company Size</label>
              <p class="data-value">{{ profile.company.companySize || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Website</label>
              <p class="data-value">{{ profile.company.website || '-' }}</p>
            </div>
            <div class="data-item">
              <label class="data-label">Billing Address</label>
              <p class="data-value">{{ profile.company.billingStreet }} {{ profile.company.billingNumber }}, {{ profile.company.billingDistrict }}, {{ profile.company.billingCity }}, {{ profile.company.billingCountry }} {{ profile.company.billingPostalCode }}</p>
            </div>
          </div>
        </section>

        <!-- Deactivate / Reactivate -->
        <section class="profile-section el-card el-shadow">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-exclamation-triangle"></i>
            </div>
            <h2 class="section-title">Account Status</h2>
          </div>
          <div class="status-actions">
            <div class="status-info">
              <span class="data-label">Current Status:</span>
              <pv-tag
                :value="profile.status"
                :severity="profile.status === 'ACTIVE' ? 'success' : 'danger'"
              />
            </div>
            <div class="action-buttons">
              <el-button
                v-if="profile.status === 'ACTIVE'"
                label="Deactivate Profile"
                icon="pi pi-ban"
                variant="secondary"
                severity="danger"
                @click="showDeactivateDialog = true"
              />
              <el-button
                v-if="profile.status === 'INACTIVE'"
                label="Reactivate Profile"
                icon="pi pi-check-circle"
                variant="primary"
                @click="reactivateProfile"
              />
            </div>
          </div>
        </section>
      </div>

      <footer class="profile-footer">
        © 2026 ElectroLink Systems Inc. All rights reserved.
      </footer>
    </main>

    <!-- Deactivate Dialog -->
    <el-dialog
      v-model:visible="showDeactivateDialog"
      header="Deactivate Profile"
      modal
    >
      <div class="dialog-content">
        <p>Are you sure you want to deactivate your profile? You will stop receiving assignments.</p>
        <el-input-text
          v-model="deactivateReason"
          label="Reason"
          placeholder="e.g. Temporary break"
        />
        <el-textarea
          v-model="deactivateNotes"
          label="Notes (optional)"
          placeholder="Additional details..."
          :rows="3"
        />
      </div>
      <template #footer>
        <el-button label="Cancel" variant="secondary" @click="showDeactivateDialog = false" />
        <el-button label="Deactivate" variant="primary" severity="danger" @click="deactivateProfile" />
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.profile-layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

@media (min-width: 768px) {
  .profile-layout {
    flex-direction: row;
  }
}

.profile-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #f8fafc;
}

.profile-header {
  background: white;
  border-bottom: 1px solid var(--el-bg-soft);
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

@media (min-width: 640px) {
  .profile-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.header-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.user-email {
  color: #6b7280;
  font-size: 0.875rem;
}

.role-tag {
  font-size: 0.7rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #6b7280;
}

.profile-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
}

.profile-section {
  padding: 1.5rem;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.section-icon {
  padding: 0.5rem;
  background-color: var(--el-bg-soft);
  border-radius: 8px;
  color: var(--el-custom);
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
  flex-grow: 1;
}

.view-tag {
  font-size: 0.65rem;
}

.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group-full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #374151;
  display: block;
  margin-bottom: 0.25rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.professional-data {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.data-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.data-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-value {
  font-weight: 500;
  color: var(--el-primary);
  margin: 0;
  font-size: 0.95rem;
}

.cert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.pref-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.preferences-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.pref-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.specialties-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.specialty-checkbox {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  background: var(--el-bg-soft);
  border-radius: 6px;
  cursor: pointer;
}

.notification-edit {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.status-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.profile-footer {
  margin-top: auto;
  padding: 2rem;
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
