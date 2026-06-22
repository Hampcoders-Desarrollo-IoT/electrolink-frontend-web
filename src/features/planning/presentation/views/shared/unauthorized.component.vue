<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div class="unauthorized">
    <i class="pi pi-lock unauthorized__icon"></i>
    <h2>Access Denied</h2>
    <p>You don't have permission to access this page.</p>
    <el-button label="Go Home" icon="pi pi-home" @click="router.push({ name: 'home' })" />
  </div>
</template>

<style scoped>
.unauthorized { text-align: center; padding: 4rem; }
.unauthorized__icon { font-size: 3rem; color: var(--el-warning); margin-bottom: 1rem; }
</style>
