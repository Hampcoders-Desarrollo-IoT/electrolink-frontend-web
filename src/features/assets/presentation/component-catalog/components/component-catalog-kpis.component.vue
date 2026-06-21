<script setup>
import ElKpiCard from '@/shared/presentation/components/el-kpi-card.vue';

const props = defineProps({
    totalComponents: { type: Number, default: 0 },
    activeComponents: { type: Number, default: 0 },
    inactiveComponents: { type: Number, default: 0 },
    totalTypes: { type: Number, default: 0 }
});
</script>

<template>
  <div class="cc-kpis">
    <el-kpi-card
      label="TOTAL COMPONENTS"
      :value="totalComponents"
      icon="pi pi-box"
      iconClass="kpi-card__icon--primary"
    />

    <el-kpi-card
      label="ACTIVE"
      :value="activeComponents"
      icon="pi pi-check-circle"
      iconClass="kpi-card__icon--success"
    />

    <el-kpi-card
      label="INACTIVE"
      :value="inactiveComponents"
      icon="pi pi-ban"
      iconClass="kpi-card__icon--warning"
    />

    <el-kpi-card
      label="TYPES"
      :value="totalTypes"
      icon="pi pi-th-large"
      iconClass="kpi-card__icon--info"
    >
      <template #value>
        <p class="custom-value">{{ totalTypes }} Groups</p>
      </template>
    </el-kpi-card>
  </div>
</template>

<style scoped>
.cc-kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.custom-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0.25rem 0 0;
}

@media (max-width: 768px) {
  .cc-kpis {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
