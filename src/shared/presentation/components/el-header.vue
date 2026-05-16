<script setup>
import { defineProps, defineEmits } from 'vue';
import AuthenticationSection from "@/features/iam/presentation/components/authentication-section.vue";
import LanguageSwitcher from "../components/language-switcher.vue";

const props = defineProps({
  showToggle: {
    type: Boolean,
    default: false
  },
  brandName: {
    type: String,
    default: 'ElectroLink'
  }
});

const emit = defineEmits(['toggle-sidebar']);
</script>

<template>
  <header class="el-header">
    <pv-toolbar class="header-toolbar">
      <template #start>
        <pv-button
          v-if="showToggle"
          class="p-button-text mobile-toggle"
          icon="pi pi-bars"
          @click="emit('toggle-sidebar')"
        />
        <div class="header-brand">
          <div v-if="!showToggle" class="logo-icon-small">
            <i class="pi pi-bolt"></i>
          </div>
          <h3 class="app-brand-text">{{ brandName }}</h3>
        </div>
      </template>
      <template #end>
        <div class="header-actions">
          <authentication-section />
          <language-switcher />
        </div>
      </template>
    </pv-toolbar>
  </header>
</template>

<style scoped>
.el-header {
  background-color: white;
  border-bottom: 1px solid rgba(169, 177, 186, 0.2);
  height: 64px;
  width: 100%;
  z-index: 100;
}

.header-toolbar {
  background: transparent !important;
  border: none !important;
  padding: 0 1.5rem !important;
  height: 100% !important;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--el-primary);
  border-radius: 4px;
  color: white;
  font-size: 0.8rem;
}

.app-brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1023px) {
  .app-brand-text {
    font-size: 1.1rem;
  }
}
</style>
