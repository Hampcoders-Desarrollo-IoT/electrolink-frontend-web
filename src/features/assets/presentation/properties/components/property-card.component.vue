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

const emit = defineEmits(['click']);

function getStatusSeverity(status) {
    const map = {
        'OwnerOccupied':   'success',
        'Rented':          'success',
        'Vacant':          'secondary',
        'UnderRenovation': 'warn',
        'Created':         'secondary',
        'InPortfolio':     'success',
        'Archived':        'danger'
    };
    return map[status] || 'info';
}

function getStatusLabel(status) {
    const map = {
        'OwnerOccupied': 'Owner Occupied',
        'Rented': 'Rented',
        'Vacant': 'Vacant',
        'UnderRenovation': 'Under Renovation',
        'Created': 'Created',
        'InPortfolio': 'In Portfolio',
        'Archived': 'Archived'
    };
    return map[status] || status || 'Unknown';
}
</script>

<template>
  <div
    :class="['property-card', { 'property-card--selected': selected }]"
    @click="emit('click', property)"
  >
    <div class="property-card__content">
      <!-- Icon placeholder (no image field in API) -->
      <div class="property-card__icon-wrap">
        <i class="pi pi-home property-card__icon"></i>
      </div>

      <div class="property-card__info">
        <!-- Address as main title -->
        <div class="property-card__top">
          <div class="property-card__name-row">
            <h3 class="property-card__name">{{ property.address?.street ?? '—' }} {{ property.address?.number ?? '' }}</h3>
            <pv-tag
              :value="getStatusLabel(property.status)"
              :severity="getStatusSeverity(property.status)"
              class="property-card__status"
            />
          </div>
          <p class="property-card__address">
            <i class="pi pi-map-marker"></i>
            {{ property.fullAddress }}
          </p>
        </div>

        <!-- Bottom row -->
        <div class="property-card__bottom">
          <div class="property-card__meta">
            <span v-if="property.address?.city" class="property-card__meta-item">
              <i class="pi pi-building"></i>
              {{ property.address.city }}
            </span>
            <span class="property-card__meta-item" :class="property.isActive ? 'property-card__meta-item--active' : 'property-card__meta-item--inactive'">
              <i :class="property.isActive ? 'pi pi-check-circle' : 'pi pi-times-circle'"></i>
              {{ property.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <span class="property-card__caret">
            <i class="pi pi-chevron-right"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- Selected indicator bar -->
    <div v-if="selected" class="property-card__selected-bar"></div>
  </div>
</template>

<style scoped>
.property-card {
  position: relative;
  background: white;
  border: 1px solid rgba(169, 177, 186, 0.2);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
}

.property-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.property-card--selected {
  border-color: var(--el-primary);
  box-shadow: 0 0 0 2px rgba(46, 58, 89, 0.15);
}

.property-card__content {
  display: flex;
  padding: 1rem;
  gap: 1rem;
}

.property-card__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 10px;
  background: rgba(46, 58, 89, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.property-card__icon {
  font-size: 1.4rem;
  color: var(--el-primary);
}

.property-card__info {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-width: 0;
}

.property-card__top {
  flex: 1;
}

.property-card__name-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.property-card__name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--el-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-card__address {
  font-size: 0.8rem;
  color: var(--el-warm-gray);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.property-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.property-card__meta {
  display: flex;
  gap: 0.75rem;
}

.property-card__meta-item {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--el-warm-gray);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.property-card__meta-item--active  { color: var(--el-success); }
.property-card__meta-item--inactive { color: var(--el-danger); }

.property-card__caret {
  color: var(--el-warm-gray);
  font-size: 0.75rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.property-card:hover .property-card__caret { opacity: 1; }

.property-card__selected-bar {
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: var(--el-primary);
  border-radius: 0 4px 4px 0;
}
</style>
