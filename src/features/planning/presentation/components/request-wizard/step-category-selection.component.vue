<script setup>
import { ref, onMounted } from 'vue';
import { useServiceRequestStore } from '../../../application/service-request.store.js';

const props = defineProps({
    requestId: { type: String, default: '' }
});

const emit = defineEmits(['complete', 'back']);

const store = useServiceRequestStore();
const categories = ref([]);
const selectedCategory = ref('');

onMounted(async () => {
    await store.fetchAvailableServices(props.requestId);
    categories.value = store.availableServices;
});

function selectCategory(category) {
    selectedCategory.value = category.name;
    emit('complete', { category: category.name, recipeId: category.recipeId });
}
</script>

<template>
  <div class="step-category">
    <h3 class="step-category__title">Choose a Service Category</h3>
    <p class="step-category__subtitle">Select the type of electrical service you need</p>
    <div class="step-category__grid">
      <div
        v-for="category in categories"
        :key="category.recipeId"
        :class="['step-category__card', { 'step-category__card--selected': selectedCategory === category.name }]"
        @click="selectCategory(category)"
      >
        <div class="step-category__card-header">
          <strong>{{ category.name }}</strong>
          <pv-tag v-if="category.requiresIoTCertification" value="IoT" severity="info" />
        </div>
        <p class="step-category__card-desc">{{ category.description }}</p>
        <div class="step-category__card-meta">
          <span><i class="pi pi-clock"></i> {{ category.estimatedDuration }}min</span>
          <span><i class="pi pi-dollar"></i> ${{ category.basePrice }}</span>
        </div>
      </div>
    </div>
    <div class="step-category__actions">
      <el-button label="Back" icon="pi pi-chevron-left" variant="text" @click="emit('back')" />
    </div>
  </div>
</template>

<style scoped>
.step-category__title { margin: 0 0 0.25rem; color: var(--el-primary); }
.step-category__subtitle { margin: 0 0 1.5rem; color: var(--el-warm-gray); font-size: 0.9rem; }
.step-category__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; }
.step-category__card {
  padding: 1.25rem; border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px; cursor: pointer; transition: all 0.2s;
}
.step-category__card:hover { box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08); }
.step-category__card--selected { border-color: var(--el-primary); }
.step-category__card-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.step-category__card-header strong { font-size: 1rem; color: var(--el-primary); }
.step-category__card-desc { font-size: 0.85rem; color: var(--el-warm-gray); margin: 0 0 1rem; }
.step-category__card-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--el-warm-gray); }
.step-category__card-meta i { margin-right: 0.25rem; }
.step-category__actions { margin-top: 2rem; display: flex; gap: 1rem; }
</style>
