<script setup>
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import { Drawer as PvDrawer } from "primevue";
import FooterContent from "../components/footer-content.vue";
import { useProfilesStore } from "@/features/profiles/application/profiles.store.js";
import useIamStore from "@/features/iam/application/iam.store.js";

const { t } = useI18n();
const profilesStore = useProfilesStore();
const iamStore = useIamStore();

const drawer = ref(false);
const isCollapsed = ref(false);

import { onMounted } from 'vue';

onMounted(() => {
  if (!profilesStore.profile) {
    console.log('[Layout] Profile missing on mount, loading...');
    profilesStore.loadProfile('me');
  }
});

const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

const homeownerId = computed(() => {
  const hoId = profilesStore.profile?.homeowner?.homeownerId;
  if (hoId) console.log(`[Layout] Homeowner section enabled with ID: ${hoId}`);
  return hoId || '';
});

const technicianId = computed(() => {
  const tcId = iamStore.roleSubjectId || profilesStore.profile?.technician?.technicianId;
  if (tcId) console.log(`[Layout] Technician section enabled with ID: ${tcId}`);
  return tcId || '';
});

const menuItems = computed(() => {
  const items = [
    { label: "Home", icon: "pi pi-home", to: "/home" },
  ];

  if (homeownerId.value && homeownerId.value !== 'undefined') {
    items.push({
      label: "Properties",
      icon: "pi pi-building",
      children: [
        { label: "My Properties", to: `/assets/homeowners/${homeownerId.value}/properties`, icon: "pi pi-list" },
        { label: "Property Portfolio", to: `/assets/homeowners/${homeownerId.value}/properties/dashboard`, icon: "pi pi-th-large" }
      ]
    });
  }

  if (technicianId.value && technicianId.value !== 'undefined') {
    items.push({
      label: "Inventory",
      icon: "pi pi-wrench",
      children: [
        { label: "My Inventory", to: `/assets/technicians/${technicianId.value}/inventory`, icon: "pi pi-box" },
        { label: "Component Types", to: `/assets/technicians/${technicianId.value}/component-types`, icon: "pi pi-tags" },
        { label: "Component Catalog", to: `/assets/technicians/${technicianId.value}/components`, icon: "pi pi-database" }
      ]
    });
  }

  items.push({
    label: "Monitoring",
    icon: "pi pi-bolt",
    to: "/monitoring/monitoring"
  });

  items.push(
    {
      label: "Settings",
      icon: "pi pi-cog",
      children: [
        { label: "Profile", to: "/profiles/management", icon: "pi pi-user" },
        { label: "Security", to: "/settings/security", icon: "pi pi-lock" }
      ]
    },
    { label: "About", icon: "pi pi-info-circle", to: "/about" }
  );

  return items;
});
</script>

<template>
  <pv-toast />
  <el-confirm-dialog />
  
  <div class="app-layout">
    <!-- Desktop Sidebar -->
    <el-sidebar 
      :items="menuItems" 
      :collapsed="isCollapsed"
      class="desktop-sidebar"
    >
      <template #footer>
        <div class="sidebar-footer-content">
          <pv-button 
            icon="pi pi-chevron-left" 
            class="p-button-text p-button-rounded collapse-btn"
            @click="toggleSidebar"
            :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'none' }"
          />
        </div>
      </template>
    </el-sidebar>

    <!-- Mobile Drawer -->
    <pv-drawer v-model:visible="drawer" class="mobile-drawer">
      <el-sidebar :items="menuItems" @item-click="drawer = false" />
    </pv-drawer>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- <el-header 
        :show-toggle="true" 
        @toggle-sidebar="toggleDrawer"
      /> -->

      <router-view />

      <!-- <footer class="app-footer">
        <footer-content />
      </footer> -->
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

/* Sidebar behavior */
.desktop-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-sidebar {
    display: flex;
    position: sticky;
    top: 0;
  }
}

.sidebar-footer-content {
  display: flex;
  justify-content: center;
  width: 100%;
}

.collapse-btn {
  color: white !important;
  transition: transform 0.3s ease;
}

/* Main wrapper */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex overflow */
}

/* Header */
.app-header {
  background-color: white;
  border-bottom: 1px solid rgba(169, 177, 186, 0.2);
  height: 64px;
}

.header-toolbar {
  background: transparent !important;
  border: none !important;
  padding: 0 1.5rem !important;
}

.app-brand-mobile {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
  margin-left: 1rem;
}

@media (min-width: 1024px) {
  .mobile-toggle, .app-brand-mobile {
    display: none;
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Content Area */
.content-viewport {
  flex: 1;
  padding: 2rem;
  background-color: var(--el-bg-soft);
}

/* Footer */
.app-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(169, 177, 186, 0.1);
  background-color: white;
}

/* Mobile drawer overrides */
:deep(.mobile-drawer) {
  padding: 0;
  background-color: var(--el-primary);
  width: 280px !important;
}

:deep(.mobile-drawer .el-sidebar) {
  width: 100%;
  border: none;
}
</style>
