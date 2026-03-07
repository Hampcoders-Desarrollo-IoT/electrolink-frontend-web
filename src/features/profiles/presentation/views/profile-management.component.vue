<script setup>
import { ref, computed } from 'vue';
import useIamStore from '../../../iam/application/iam.store.js';
import ElButton from '../../../../shared/presentation/components/el-button.vue';
import ElCheckbox from '../../../../shared/presentation/components/el-checkbox.vue';

const iamStore = useIamStore();
const currentUser = computed(() => iamStore.currentUsername);

const isAvailable = ref(true);

// Mock data for the profile management view
const profileData = {
  name: 'Alex Thompson',
  role: 'Senior Field Technician',
  email: 'alex.t@electrolink.com',
  phone: '+1 (555) 012-3456',
  location: 'Regional HQ - Austin, TX'
};

const certifications = ['Certified Electrician (L4)', 'Solar Installation Pro', 'OSHA Safety'];
const experience = '8 Years';
const vehicle = 'Van #402 - TX 492-XPT';

// Preferences
const emailNotifications = ref(true);
const smsAlerts = ref(false);
const highContrast = ref(false);

// Navigation items
const activeNav = ref('profile');
const navItems = [
  { key: 'profile', label: 'My Profile', icon: 'pi pi-user' },
  { key: 'projects', label: 'Projects', icon: 'pi pi-clipboard' },
  { key: 'settings', label: 'Settings', icon: 'pi pi-cog' }
];
</script>

<template>
  <div class="profile-layout">
    <!-- Sidebar -->
    <aside class="profile-sidebar">
      <div class="sidebar-brand">
        <div class="brand-icon">E</div>
        <span class="brand-name">ElectroLink</span>
      </div>

      <nav class="sidebar-nav">
        <a
          v-for="item in navItems"
          :key="item.key"
          href="#"
          class="nav-item"
          :class="{ 'nav-active': activeNav === item.key }"
          @click.prevent="activeNav = item.key"
        >
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </a>
      </nav>

      <!-- Danger Zone -->
      <div class="sidebar-footer">
        <button class="deactivate-btn">
          <i class="pi pi-user-minus"></i>
          <span>Deactivate Account</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="profile-main">
      <!-- Header -->
      <header class="profile-header">
        <div class="header-user">
          <pv-avatar
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuDjUhkreTgGfgji1OGKPVGQ1asBf-hk8DcsJRnfgdP4vc7wDHmxOohOmwz1RTSaFaSxCV7Wsu0erDY1ChKaO88a-9ErQpM8MZzIuqefV9uBpjXkTMkMC0LRMSHo7L4-VUErHG0ZIRnPz-kva-_GcXocSPqrm2pmTtvcYcAirAxphgcRf1QFeHRUaCMbIZTDWPjujzCJfvNH7HgkNzkb6iFeLzb_1j1yspldyfgPy3bKXgZpLMJCNqd3XR5cO0mfwnJ86kq3Jxr3ZOIm"
            shape="circle"
            size="xlarge"
            class="user-avatar"
          />
          <div class="user-info">
            <h1 class="user-name">{{ profileData.name }}</h1>
            <p class="user-role">{{ profileData.role }}</p>
          </div>
        </div>
        <el-button label="Edit Profile" icon="pi pi-pencil" variant="secondary" />
      </header>

      <!-- Dashboard Body -->
      <div class="profile-body">
        <div class="profile-grid">
          <!-- Personal Data Section -->
          <section class="profile-section el-card el-shadow">
            <div class="section-header">
              <div class="section-icon">
                <i class="pi pi-user"></i>
              </div>
              <h2 class="section-title">Personal Data</h2>
            </div>
            <div class="data-grid">
              <div class="data-item">
                <label class="data-label">Full Name</label>
                <p class="data-value">{{ profileData.name }}</p>
              </div>
              <div class="data-item">
                <label class="data-label">Email Address</label>
                <p class="data-value">{{ profileData.email }}</p>
              </div>
              <div class="data-item">
                <label class="data-label">Phone Number</label>
                <p class="data-value">{{ profileData.phone }}</p>
              </div>
              <div class="data-item">
                <label class="data-label">Office Location</label>
                <p class="data-value">{{ profileData.location }}</p>
              </div>
            </div>
          </section>

          <!-- Professional Profile Section -->
          <section class="profile-section el-card el-shadow">
            <div class="section-header">
              <div class="section-icon">
                <i class="pi pi-briefcase"></i>
              </div>
              <h2 class="section-title">Professional Profile</h2>
              <pv-tag value="TECH VIEW" severity="info" class="view-tag" />
            </div>
            <div class="professional-data">
              <div class="data-item">
                <label class="data-label">Primary Certifications</label>
                <div class="cert-tags">
                  <pv-tag
                    v-for="cert in certifications"
                    :key="cert"
                    :value="cert"
                    severity="secondary"
                  />
                </div>
              </div>
              <div class="data-item">
                <label class="data-label">Years of Experience</label>
                <p class="data-value">{{ experience }}</p>
              </div>
              <div class="data-item">
                <label class="data-label">Assigned Vehicle</label>
                <p class="data-value">{{ vehicle }}</p>
              </div>
            </div>
          </section>
        </div>

        <!-- Preferences Section -->
        <section class="profile-section el-card el-shadow preferences-section">
          <div class="section-header">
            <div class="section-icon">
              <i class="pi pi-sliders-h"></i>
            </div>
            <h2 class="section-title">Account Preferences</h2>
            <pv-tag value="OWNER VIEW" class="view-tag-dark" />
          </div>
          <div class="preferences-grid">
            <div class="pref-item">
              <div class="pref-row">
                <el-checkbox v-model="emailNotifications" label="Email Notifications" />
              </div>
              <p class="pref-desc">Receive daily project digests and urgent alerts via email.</p>
            </div>
            <div class="pref-item">
              <div class="pref-row">
                <el-checkbox v-model="smsAlerts" label="SMS Alerts" />
              </div>
              <p class="pref-desc">Get text messages for immediate schedule changes.</p>
            </div>
            <div class="pref-item">
              <div class="pref-row">
                <el-checkbox v-model="highContrast" label="High Contrast Mode" />
              </div>
              <p class="pref-desc">Enable high contrast UI for better outdoor visibility.</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Footer -->
      <footer class="profile-footer">
        © 2026 ElectroLink Systems Inc. All rights reserved.
      </footer>
    </main>
  </div>
</template>

<style scoped>
/* Layout */
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

/* Sidebar */
.profile-sidebar {
  width: 100%;
  background-color: var(--el-primary);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 2rem;
}

@media (min-width: 768px) {
  .profile-sidebar {
    width: 16rem;
    min-height: 100vh;
  }
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 0.5rem;
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  background-color: var(--el-custom);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
}

.nav-active {
  background-color: rgba(25, 120, 229, 0.2);
  color: var(--el-celeste);
  border-left: 4px solid var(--el-custom);
}

.sidebar-footer {
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.deactivate-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: #f87171;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.deactivate-btn:hover {
  background-color: rgba(248, 113, 113, 0.1);
}

/* Main Content */
.profile-main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #f8fafc;
}

/* Header */
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

.user-role {
  color: #6b7280;
  font-weight: 500;
  margin: 0;
}

/* Body */
.profile-body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 72rem;
  margin: 0 auto;
  width: 100%;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .profile-grid {
    grid-template-columns: 1fr 1fr;
  }
}

/* Sections */
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

.view-tag-dark {
  font-size: 0.65rem;
  background-color: var(--el-primary) !important;
  color: var(--el-accent) !important;
}

/* Data Display */
.data-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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

/* Preferences */
.preferences-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .preferences-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pref-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pref-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pref-label {
  font-size: 0.875rem;
  font-weight: 500;
}

.pref-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Footer */
.profile-footer {
  margin-top: auto;
  padding: 2rem;
  text-align: center;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
