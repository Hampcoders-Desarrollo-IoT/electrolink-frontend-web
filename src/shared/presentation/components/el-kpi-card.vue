<script setup>
import { Card as PvCard } from 'primevue';

defineProps({
    label: { type: String, required: true },
    value: { type: [String, Number], required: true },
    icon: { type: String, required: true },
    iconClass: { type: String, default: 'kpi-card__icon--primary' }
});
</script>

<template>
  <pv-card class="kpi-card">
    <template #content>
      <div class="kpi-card__inner">
        <i :class="[icon, 'kpi-card__icon', iconClass]"></i>
        <div class="kpi-card__content-box">
          <p class="kpi-card__label">{{ label }}</p>
          <slot name="value">
            <p class="kpi-card__value">{{ value }}</p>
          </slot>
        </div>
      </div>
    </template>
  </pv-card>
</template>

<style scoped>
.kpi-card {
  border: 1px solid #e5e7eb !important;
  background-color: white !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  border-radius: 12px !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  height: 100%;
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08) !important;
}

.kpi-card__inner {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.kpi-card__icon {
  font-size: 1.5rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  flex-shrink: 0;
}

.kpi-card__icon--primary {
  background-color: rgba(46, 58, 89, 0.1);
  color: var(--el-primary, #2e3a59);
}

.kpi-card__icon--success {
  background-color: rgba(16, 185, 129, 0.1);
  color: var(--el-success, #10b981);
}

.kpi-card__icon--warning {
  background-color: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.kpi-card__icon--info {
  background-color: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.kpi-card__content-box {
  display: flex;
  flex-direction: column;
}

.kpi-card__label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6b7280;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0;
}

.kpi-card__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0.25rem 0 0;
}
</style>
