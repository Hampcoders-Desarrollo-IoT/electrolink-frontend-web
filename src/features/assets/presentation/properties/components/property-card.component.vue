<script setup>
const props = defineProps({
    property: {
        type: Object,
        required: true
    },
    selected: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['click', 'viewInsights']);

function getStatusSeverity(status) {
    const map = {
        'Occupied': 'success',
        'Vacant': 'secondary',
        'Maintenance': 'warn',
        'Under Review': 'warn'
    };
    return map[status] || 'info';
}
</script>

<template>
  <div
    :class="['property-card', { 'property-card--selected': selected, 'property-card--alerts': property.hasAlerts }]"
    @click="emit('click', property)"
  >
    <div class="property-card__content">
      <div
        class="property-card__image"
        :style="property.image ? { backgroundImage: `url(${property.image})` } : {}"
      >
        <i v-if="!property.image" class="pi pi-home property-card__image-fallback"></i>
      </div>

      <div class="property-card__info">
        <div class="property-card__top">
          <div class="property-card__name-row">
            <h3 class="property-card__name">{{ property.name }}</h3>
            <pv-tag
              :value="property.status"
              :severity="getStatusSeverity(property.status)"
              class="property-card__status"
            />
          </div>
          <p class="property-card__address">
            <i class="pi pi-map-marker"></i>
            {{ property.fullAddress }}
          </p>
        </div>

        <div class="property-card__bottom">
          <div class="property-card__indicators">
            <span v-if="property.efficiency" class="property-card__indicator">
              <i class="pi pi-bolt"></i> {{ property.efficiency }}% Efficiency
            </span>
            <span v-if="property.hasAlerts" class="property-card__indicator property-card__indicator--alert">
              <i class="pi pi-exclamation-triangle"></i> {{ property.alerts }} Alerts
            </span>
            <span v-if="property.evPorts" class="property-card__indicator">
              <i class="pi pi-car"></i> {{ property.evPorts }} EV Ports
            </span>
          </div>
          <span class="property-card__view-insights" @click.stop="emit('viewInsights', property)">
            View Insights
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.property-card {
  background: white;
  border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.property-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.property-card--selected {
  border-left: 4px solid var(--el-primary);
}

.property-card--alerts {
  border-left: 4px solid var(--el-danger);
}

.property-card__content {
  display: flex;
  padding: 1rem;
  gap: 1rem;
}

.property-card__image {
  width: 96px;
  height: 96px;
  border-radius: 10px;
  background-color: var(--el-bg-soft);
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.property-card__image-fallback {
  font-size: 2rem;
  color: var(--el-warm-gray);
}

.property-card__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}

.property-card__name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.property-card__name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--el-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-card__address {
  font-size: 0.85rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.property-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.property-card__indicators {
  display: flex;
  gap: 0.75rem;
}

.property-card__indicator {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--el-warm-gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.property-card__indicator--alert {
  color: var(--el-danger);
}

.property-card__view-insights {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--el-primary);
  cursor: pointer;
  transition: color 0.2s;
}

.property-card__view-insights:hover {
  color: #3d4a6d;
}
</style>
