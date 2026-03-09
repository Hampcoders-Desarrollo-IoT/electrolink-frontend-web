<script setup>
import { computed, onMounted } from 'vue';
import { usePropertiesStore } from '../../../application/properties.store.js';
import { useRouter } from 'vue-router';

const propertiesStore = usePropertiesStore();
const router = useRouter();

onMounted(() => {
    propertiesStore.loadProperties();
});

const trendBadge = computed(() => {
    return '+3 from last month';
});

function getStatusSeverity(status) {
    const map = {
        'Occupied': 'success',
        'Vacant': 'secondary',
        'Maintenance': 'warn',
        'Under Review': 'warn'
    };
    return map[status] || 'info';
}

function formatCurrency(value) {
    return `$${Number(value).toLocaleString()}`;
}

function goToAddProperty() {
    router.push({ name: 'assets-property-new' });
}

// Chart data for portfolio efficiency
const chartData = computed(() => ({
    labels: propertiesStore.properties.map(p => p.name),
    datasets: [{
        label: 'Efficiency %',
        data: propertiesStore.properties.map(p => p.efficiency || Math.floor(Math.random() * 40) + 60),
        backgroundColor: [
            'rgba(46, 58, 89, 0.8)',
            'rgba(46, 58, 89, 0.65)',
            'rgba(46, 58, 89, 0.5)',
            'rgba(46, 58, 89, 0.35)',
            'rgba(46, 58, 89, 0.2)'
        ],
        borderRadius: 6
    }]
}));

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        y: {
            beginAtZero: true,
            max: 100,
            ticks: { font: { size: 11 } },
            grid: { color: 'rgba(0,0,0,0.04)' }
        },
        x: {
            ticks: { font: { size: 10 } },
            grid: { display: false }
        }
    }
};
</script>

<template>
  <div class="portfolio-view">
    <!-- Header -->
    <div class="portfolio-view__header">
      <div>
        <h1 class="portfolio-view__title">Property Portfolio</h1>
        <p class="portfolio-view__subtitle">Manage your connected residential assets and utility endpoints.</p>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="portfolio-view__kpis">
      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <div>
              <p class="kpi-card__label">Total Properties</p>
              <p class="kpi-card__value-large">{{ propertiesStore.totalProperties }}</p>
              <pv-tag :value="trendBadge" severity="success" class="kpi-card__trend" />
            </div>
            <i class="pi pi-home kpi-card__icon-large"></i>
          </div>
        </template>
      </pv-card>

      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <div>
              <p class="kpi-card__label">Occupancy Rate</p>
              <p class="kpi-card__value-large">{{ propertiesStore.occupancyRate }}%</p>
              <pv-progress-bar :value="propertiesStore.occupancyRate" :showValue="false" class="kpi-card__progress" />
            </div>
            <i class="pi pi-chart-pie kpi-card__icon-large"></i>
          </div>
        </template>
      </pv-card>

      <pv-card class="kpi-card">
        <template #content>
          <div class="kpi-card__inner">
            <div>
              <p class="kpi-card__label">Monthly Revenue</p>
              <p class="kpi-card__value-large">{{ formatCurrency(propertiesStore.totalMonthlyRevenue) }}</p>
              <span class="kpi-card__sub">Per month at your plan</span>
            </div>
            <i class="pi pi-dollar kpi-card__icon-large"></i>
          </div>
        </template>
      </pv-card>
    </div>

    <!-- Property Entries Table -->
    <pv-card class="portfolio-view__entries">
      <template #content>
        <div class="portfolio-view__entries-header">
          <h2 class="portfolio-view__entries-title">Property Entries</h2>
          <el-button variant="primary" icon="pi pi-plus" label="Add Property" @click="goToAddProperty" />
        </div>

        <pv-data-table
          :value="propertiesStore.properties"
          :loading="propertiesStore.isLoading"
          dataKey="id"
          responsiveLayout="scroll"
          class="portfolio-table"
          paginator
          :rows="5"
          stripedRows
        >
          <pv-column header="NICKNAME & ADDRESS" style="min-width: 16rem">
            <template #body="{ data }">
              <div class="portfolio-table__property">
                <span class="portfolio-table__name">
                  {{ data.name }}
                  <pv-tag v-if="data.isPrimary" value="PRIMARY" severity="info" class="portfolio-table__primary-badge" />
                </span>
                <span class="portfolio-table__address">{{ data.fullAddress }}</span>
              </div>
            </template>
          </pv-column>

          <pv-column field="status" header="STATUS" style="min-width: 8rem">
            <template #body="{ data }">
              <pv-tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </pv-column>

          <pv-column field="type" header="TYPE" style="min-width: 10rem" />

          <pv-column header="ACTIONS" style="min-width: 8rem">
            <template #body="{ data }">
              <el-button v-if="!data.isPrimary" variant="ghost" label="Set as Primary" />
            </template>
          </pv-column>
        </pv-data-table>
      </template>
    </pv-card>

    <!-- Bottom Row: Charts -->
    <div class="portfolio-view__charts">
      <pv-card class="portfolio-view__chart-card">
        <template #title>Portfolio Efficiency</template>
        <template #content>
          <div class="portfolio-view__chart-container">
            <p class="portfolio-view__chart-placeholder">
              <i class="pi pi-chart-bar" style="font-size: 2rem; color: var(--el-warm-gray);"></i>
              <br />Bar chart loads here (Chart.js integration)
            </p>
          </div>
          <p class="portfolio-view__chart-note">
            Based on your utility consumption patterns, your portfolio is performing efficiently.
          </p>
        </template>
      </pv-card>

      <pv-card class="portfolio-view__chart-card">
        <template #title>Geographic Distribution</template>
        <template #content>
          <div class="portfolio-view__chart-container">
            <p class="portfolio-view__chart-placeholder">
              <i class="pi pi-map" style="font-size: 2rem; color: var(--el-warm-gray);"></i>
              <br />Mini map loads here (Leaflet integration)
            </p>
          </div>
          <div class="portfolio-view__location-chips">
            <pv-tag v-for="p in propertiesStore.properties" :key="p.id" :value="p.city" severity="info" />
          </div>
        </template>
      </pv-card>
    </div>
  </div>
</template>

<style scoped>
.portfolio-view {
  padding: 2rem;
  background-color: var(--el-bg-soft);
  min-height: 100vh;
}

.portfolio-view__header {
  margin-bottom: 1.5rem;
}

.portfolio-view__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.portfolio-view__subtitle {
  font-size: 0.9rem;
  color: var(--el-warm-gray);
  margin: 0.25rem 0 0;
}

.portfolio-view__kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.kpi-card__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.kpi-card__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--el-warm-gray);
  margin: 0;
}

.kpi-card__value-large {
  font-size: 2rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0.25rem 0;
}

.kpi-card__icon-large {
  font-size: 1.5rem;
  color: var(--el-warm-gray);
  opacity: 0.5;
}

.kpi-card__trend {
  font-size: 0.7rem;
}

.kpi-card__progress {
  height: 6px;
  margin-top: 0.5rem;
  border-radius: 3px;
}

.kpi-card__sub {
  font-size: 0.75rem;
  color: var(--el-warm-gray);
}

.portfolio-view__entries {
  margin-bottom: 1.5rem;
}

.portfolio-view__entries-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.portfolio-view__entries-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--el-primary);
  margin: 0;
}

.portfolio-table__property {
  display: flex;
  flex-direction: column;
}

.portfolio-table__name {
  font-weight: 600;
  color: var(--el-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.portfolio-table__address {
  font-size: 0.8rem;
  color: var(--el-warm-gray);
}

.portfolio-view__charts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.portfolio-view__chart-container {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-bg-soft);
  border-radius: 10px;
  margin-bottom: 0.75rem;
}

.portfolio-view__chart-placeholder {
  text-align: center;
  color: var(--el-warm-gray);
  font-size: 0.85rem;
}

.portfolio-view__chart-note {
  font-size: 0.8rem;
  color: var(--el-warm-gray);
  margin: 0;
}

.portfolio-view__location-chips {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .portfolio-view__kpis {
    grid-template-columns: 1fr;
  }

  .portfolio-view__charts {
    grid-template-columns: 1fr;
  }
}
</style>
