<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useIamStore from '@/features/iam/application/iam.store.js';

const props = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  collapsed: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const router = useRouter();
const iamStore = useIamStore();
const openMenus = ref(new Set());

const toggleMenu = (label) => {
  if (openMenus.value.has(label)) {
    openMenus.value.delete(label);
  } else {
    openMenus.value.add(label);
  }
};

const isMenuActive = (item) => {
  if (item.to && route.path.startsWith(item.to)) return true;
  if (item.children) {
    return item.children.some(child => isMenuActive(child));
  }
  return false;
};

const isMenuOpen = (label) => openMenus.value.has(label);

const performSignOut = () => {
  iamStore.signOut(router);
};
</script>

<template>
  <aside 
    :class="['el-sidebar', { 'el-sidebar--collapsed': collapsed }]"
  >
    <!-- Logo Section -->
    <div class="el-sidebar-header">
      <div class="el-sidebar-logo">
        <i class="pi pi-bolt"></i>
      </div>
      <span v-if="!collapsed" class="el-sidebar-title">ElectroLink</span>
    </div>

    <!-- Navigation Section -->
    <nav class="el-sidebar-nav">
      <ul class="el-sidebar-list">
        <li v-for="item in items" :key="item.label" class="el-sidebar-item-wrapper">
          <!-- Item with children (Dropdown) -->
          <div v-if="item.children" class="el-sidebar-dropdown">
            <button 
              @click="toggleMenu(item.label)"
              :class="[
                'el-sidebar-item', 
                'el-sidebar-item--dropdown',
                { 'el-sidebar-item--active': isMenuActive(item) },
                { 'el-sidebar-item--open': isMenuOpen(item.label) }
              ]"
            >
              <div class="el-sidebar-item-content">
                <i :class="[item.icon || 'pi pi-circle', 'el-sidebar-icon']"></i>
                <span v-if="!collapsed" class="el-sidebar-label">{{ item.label }}</span>
              </div>
              <i 
                v-if="!collapsed" 
                :class="['pi pi-chevron-down', 'el-sidebar-chevron', { 'el-sidebar-chevron--open': isMenuOpen(item.label) }]"
              ></i>
            </button>
            
            <Transition name="expand">
              <ul v-if="isMenuOpen(item.label) && !collapsed" class="el-sidebar-sublist">
                <li v-for="child in item.children" :key="child.label">
                  <router-link 
                    :to="child.to" 
                    :class="['el-sidebar-subitem', { 'el-sidebar-subitem--active': route.path.startsWith(child.to) }]"
                  >
                    <i :class="[child.icon || 'pi pi-circle-fill', 'el-sidebar-subicon']"></i>
                    <span>{{ child.label }}</span>
                  </router-link>
                </li>
              </ul>
            </Transition>
          </div>

          <!-- Simple Item -->
          <router-link 
            v-else 
            :to="item.to" 
            :class="['el-sidebar-item', { 'el-sidebar-item--active': route.path.startsWith(item.to) }]"
          >
            <div class="el-sidebar-item-content">
              <i :class="[item.icon || 'pi pi-home', 'el-sidebar-icon']"></i>
              <span v-if="!collapsed" class="el-sidebar-label">{{ item.label }}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Footer / Bottom Section -->
    <div class="el-sidebar-footer">
      <div class="el-sidebar-footer-nav">
        <button class="el-sidebar-item el-sidebar-item--danger" @click="performSignOut">
          <div class="el-sidebar-item-content">
            <i class="pi pi-sign-out el-sidebar-icon"></i>
            <span v-if="!collapsed" class="el-sidebar-label">Sign Out</span>
          </div>
        </button>
        <slot name="footer"></slot>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.el-sidebar {
  display: flex;
  flex-direction: column;
  background-color: var(--el-primary);
  color: white;
  width: 260px;
  height: 100vh;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.el-sidebar--collapsed {
  width: 80px;
}

/* Header */
.el-sidebar-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.el-sidebar-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: var(--el-custom);
  border-radius: 8px;
  color: white;
  font-size: 1.25rem;
}

.el-sidebar-title {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  white-space: nowrap;
}

/* Nav */
.el-sidebar-nav {
  flex: 1;
  padding: 0 16px;
}

.el-sidebar-list, .el-sidebar-sublist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.el-sidebar-item-wrapper {
  margin-bottom: 4px;
}

.el-sidebar-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.95rem;
  font-weight: 500;
}

.el-sidebar-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.el-sidebar-item--active {
  background-color: rgba(25, 120, 229, 0.2);
  color: var(--el-celeste);
  font-weight: 600;
  border-left: 3px solid var(--el-custom);
}

.el-sidebar-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.el-sidebar-icon {
  font-size: 1.1rem;
  width: 20px;
}

.el-sidebar-label {
  white-space: nowrap;
}

.el-sidebar-chevron {
  font-size: 0.75rem;
  transition: transform 0.3s ease;
}

.el-sidebar-chevron--open {
  transform: rotate(180deg);
}

/* Submenu */
.el-sidebar-sublist {
  padding-left: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: 24px;
}

.el-sidebar-subitem {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 14px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.el-sidebar-subitem:hover {
  color: white;
}

.el-sidebar-subitem--active {
  color: var(--el-celeste);
  font-weight: 600;
}

.el-sidebar-subicon {
  font-size: 0.4rem;
  opacity: 0.5;
}

/* Footer */
.el-sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.el-sidebar-footer-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.el-sidebar-item--danger {
  color: #ff4d4f;
}

.el-sidebar-item--danger:hover {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff7875;
}

/* Transitions */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  opacity: 1;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
