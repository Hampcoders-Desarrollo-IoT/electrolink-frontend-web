<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '../../../application/property.store.js';
import { usePropertyPortfolioStore } from '../../../application/property-portfolio.store.js';
import AddPropertyPortfolioModal from '../components/add-property-portfolio-modal.component.vue';
import ElKpiCard from '@/shared/presentation/components/el-kpi-card.vue';
import ElButton from '@/shared/presentation/components/el-button.vue';
import ElMap from '@/shared/presentation/components/el-map.vue';
import ElTableCard from '@/shared/presentation/components/el-table-card.vue';
import ElChip from '@/shared/presentation/components/el-chip.vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const propertiesStore = usePropertyStore();
const portfolioStore  = usePropertyPortfolioStore();
const router = useRouter();
const route  = useRoute();
const toast  = useToast();
const confirm = useConfirm();

const isCompanyContext = computed(() => route.name?.startsWith('assets-company'));
const ownerParam = computed(() => route.params.homeownerId || route.params.ownerId);
const showAddModal = ref(false);

onMounted(() => {
    propertiesStore.loadProperties(ownerParam.value, {}, isCompanyContext.value ? 'company' : 'homeowner');
    portfolioStore.loadPortfolio(ownerParam.value);
});

function getStatusVariant(status) {
    const map = {
        'OwnerOccupied':     'success',
        'Rented':            'success',
        'Vacant':            'info',
        'UnderRenovation':   'warning'
    };
    return map[status] || 'info';
}

function goToAddProperty() {
    showAddModal.value = true;
}

function onPortfolioUpdated() {
    portfolioStore.loadPortfolio(ownerParam.value);
    toast.add({ severity: 'success', summary: 'Success', detail: 'Property added to portfolio', life: 3000 });
}

function confirmRemove(data) {
    confirm.require({
        message: `Are you sure you want to remove '${data.nickname}' from your portfolio?`,
        header: 'Remove Property',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        accept: async () => {
            await portfolioStore.removePropertyFromPortfolio(ownerParam.value, data.propertyId, "User requested removal via UI");
            toast.add({ severity: 'success', summary: 'Removed', detail: 'Property removed from portfolio', life: 3000 });
            portfolioStore.loadPortfolio(ownerParam.value);
        }
    });
}

// Map the "Dashboard / Properties / Portfolio ..." links in the mockup
function goToList() {
    const routeName = isCompanyContext.value ? 'assets-company-properties' : 'assets-homeowner-properties';
    const paramKey = isCompanyContext.value ? 'ownerId' : 'homeownerId';
    router.push({
        name:   routeName,
        params: { [paramKey]: ownerParam.value }
    });
}

// Map portfolio entries
const enrichedProperties = computed(() => {
    const entries = portfolioStore.portfolio?.properties ?? [];
    return entries.map(entry => {
        const prop = propertiesStore.properties.find(p => p.id === entry.propertyId);
        return {
            ...(prop || {}),
            propertyId:      entry.propertyId,
            nickname:        entry.nickname,
            isPrimary:       entry.isPrimary,
            occupancyStatus: entry.occupancyStatus,
            fullAddress:     prop ? `${prop.address?.street} ${prop.address?.number}, ${prop.address?.city}` : 'Unknown Address'
        };
    });
});

// KPI computeds
const totalProperties = computed(() => propertiesStore.totalProperties);
const occupancyRate   = computed(() => propertiesStore.occupancyRate);

// Map markers
const mapMarkers = computed(() =>
    propertiesStore.properties
        .filter(p => p.geolocation?.latitude && p.geolocation?.longitude)
        .map(p => ({
            lat:   p.geolocation.latitude,
            lng:   p.geolocation.longitude,
            popup: p.fullAddress,
            type:  'property'
        }))
);

const selectedCenter = computed(() => {
    if (mapMarkers.value.length > 0) {
        return [mapMarkers.value[0].lat, mapMarkers.value[0].lng];
    }
    return undefined;
});
</script>

<template>
  <div class="portfolio-container">
    <!-- Main Content -->
    <main class="portfolio-content">
        <!-- Header -->
        <header class="portfolio-header">
            <h1 class="header-title">Property Portfolio</h1>
            <p class="header-subtitle">Manage your connected residential assets and utility endpoints.</p>
        </header>

        <!-- KPI Cards -->
        <section class="kpi-grid">
          <el-kpi-card
            label="Total Properties"
            :value="totalProperties || '12'"
            icon="pi pi-building"
            iconClass="kpi-card__icon--primary"
          />

          <el-kpi-card
            label="Occupancy Rate"
            :value="(occupancyRate || '83.3') + '%'"
            icon="pi pi-users"
            iconClass="kpi-card__icon--success"
          />

          <el-kpi-card
            label="Monthly Revenue"
            value="$24,450"
            icon="pi pi-dollar"
            iconClass="kpi-card__icon--warning"
          />
        </section>

        <!-- Property Entries Table -->
        <section class="table-section">
            <add-property-portfolio-modal 
                v-model="showAddModal" 
                :homeownerId="ownerParam"
                :context="isCompanyContext ? 'company' : 'homeowner'"
                @save="onPortfolioUpdated"
            />
            <el-table-card
              :items="enrichedProperties"
              :loading="propertiesStore.isLoading || portfolioStore.isLoading"
              :searchable="false"
              :rows="5"
            >
              <template #header-actions>
                   <h2 class="table-title">Property Entries</h2>
                   <div class="table-actions">
                        <el-button 
                            @click="goToAddProperty" 
                            variant="primary" 
                            label="Add to Portfolio" 
                            icon="pi pi-plus" 
                            class="add-btn" 
                        />
                   </div>
              </template>

              <template #columns>
                  <pv-column header="NICKNAME & ADDRESS" class="col-address">
                    <template #body="{ data }">
                      <div class="property-cell" :class="{'active-row': (data.occupancyStatus || data.status) === 'OwnerOccupied' || (data.occupancyStatus || data.status) === 'Rented'}">
                        <div class="icon-box">
                            <i class="pi pi-home"></i>
                        </div>
                        <div class="cell-details">
                          <div class="nickname-row">
                            <span class="cell-nickname">{{ data.nickname || (data.address?.street + ' ' + data.address?.number) }}</span>
                            <span v-if="data.isPrimary" class="primary-tag">Primary</span>
                          </div>
                          <span class="cell-address-line">{{ data.fullAddress }}</span>
                        </div>
                      </div>
                    </template>
                  </pv-column>

                  <pv-column header="STATUS" class="col-status">
                    <template #body="{ data }">
                      <span class="status-pill" :class="getStatusVariant(data.occupancyStatus || data.status)">
                        <span class="status-dot"></span> {{ data.occupancyStatus || data.status || 'Vacant' }}
                      </span>
                    </template>
                  </pv-column>

                  <pv-column header="TYPE" class="col-type">
                    <template #body="{ data }">
                      <span class="text-type">{{ data.propertyType || 'Single Family Home' }}</span>
                    </template>
                  </pv-column>

                  <pv-column header="ACTIONS" class="col-actions">
                    <template #body="{ data }">
                      <div class="action-group">
                          <button v-if="!data.isPrimary" class="primary-link">Set as Primary</button>
                          <button class="delete-btn" @click.stop="confirmRemove(data)">
                               <i class="pi pi-trash"></i>
                          </button>
                      </div>
                    </template>
                  </pv-column>
              </template>
            </el-table-card>
        </section>

    </main>
  </div>
</template>

<style scoped>
.portfolio-container {
    min-height: 100vh;
    background-color: #f0f4f8; /* Match mockup bg */
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
}

/* Nav */
.portfolio-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    padding: 1rem 2rem;
    background-color: #f0f4f8;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo-area {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.logo-icon {
    font-size: 1.5rem;
    color: #1e293b;
}

.logo-text {
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.025em;
}

.nav-links {
    display: flex;
    gap: 2rem;
    align-items: center;
}

.nav-link {
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    transition: color 0.2s;
}

.nav-link:hover { color: #1e293b; }

.nav-link.active {
    color: #1e293b;
    border-bottom: 4px solid #1e293b;
    padding-bottom: 0.25rem;
}

.nav-user {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-notify {
    padding: 0.5rem;
    color: #64748b;
    border: none;
    background: none;
    cursor: pointer;
}

.avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background-color: #93c5fd;
    border: 2px solid #60a5fa;
    cursor: pointer;
}

/* Content */
.portfolio-content {
    flex-grow: 1;
    padding: 1.5rem 2rem;
    max-width: 1440px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.header-title {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.5rem;
}

.header-subtitle {
    color: #64748b;
}

/* KPI */
.kpi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 768px) {
    .kpi-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
    .kpi-grid { grid-template-columns: repeat(3, 1fr); }
}

/* Table */
.table-section {
    background-color: #ffffff;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.table-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1e293b;
    margin-left: 1.5rem;
}

.table-actions {
    margin-right: 1.5rem;
}

.add-btn {
    background-color: #1e293b !important;
    border-radius: 0.5rem !important;
}

:deep(.p-datatable-header) {
    padding: 1.5rem 0 !important;
    border-bottom: 1px solid #f8fafc !important;
}

:deep(.p-datatable-thead > tr > th) {
    background-color: rgba(248, 250, 252, 0.5) !important;
    font-size: 0.75rem !important;
    font-weight: 600 !important;
    color: #64748b !important;
    letter-spacing: 0.05em !important;
}

.property-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 0;
}

.property-cell.active-row {
    background-color: rgba(239, 246, 255, 0.3); /* Soft blue for active row */
}

.icon-box {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    background-color: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
}

.nickname-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.cell-nickname {
    font-weight: 700;
    color: #1e293b;
}

.primary-tag {
    font-size: 10px;
    font-weight: 700;
    color: #854d0e;
    background-color: #fef9c3;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    text-transform: uppercase;
}

.cell-address-line {
    font-size: 0.75rem;
    color: #64748b;
}

.status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
}

.status-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 9999px;
}

.status-pill.success { background-color: #dbeafe; color: #1e40af; }
.status-pill.success .status-dot { background-color: #3b82f6; }

.status-pill.warning { background-color: #fef3c7; color: #92400e; }
.status-pill.warning .status-dot { background-color: #f59e0b; }

.status-pill.info { background-color: #f3f4f6; color: #374151; }
.status-pill.info .status-dot { background-color: #9ca3af; }

.text-type { color: #475569; }

.primary-link {
    font-size: 0.75rem;
    font-weight: 500;
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
}

.delete-btn {
    color: #f87171;
    background: none;
    border: none;
    cursor: pointer;
}

/* Row 2 bg like mockup */
:deep(.p-datatable-tbody > tr:nth-child(2)) {
    background-color: rgba(239, 246, 255, 0.3);
}

/* Charts */
.charts-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
}

@media (min-width: 1024px) {
    .charts-row { grid-template-columns: 1fr 1fr; }
}

.chart-card {
    background-color: #ffffff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.chart-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.chart-title {
    font-size: 1rem;
    font-weight: 700;
}

.bar-chart-container {
    height: 12rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 1.5rem 1.5rem 0;
    background-color: #ffffff;
    margin-bottom: 1rem;
}

.bar {
    width: 15%;
    border-radius: 2px 2px 0 0;
}

.bar.b1 { background-color: #bfdbfe; }
.bar.b2 { background-color: #64748b; }
.bar.b3 { background-color: #1e293b; }
.bar.b4 { background-color: #dbeafe; }
.bar.b5 { background-color: #64748b; }

.chart-caption {
    font-size: 0.875rem;
    color: #475569;
    line-height: 1.5;
}

.map-view-container {
    height: 12rem;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    background-color: #f1f5f9;
    position: relative;
    margin-bottom: 1rem;
}

.map-overlay {
    position: absolute;
    bottom: 0.75rem;
    left: 0.75rem;
    z-index: 400;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.map-tag {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 10px;
    font-weight: 500;
    border: 1px solid #e2e8f0;
}

/* Dark Mode */
.dark .portfolio-container, .dark .portfolio-nav { background-color: #020617; }
.dark .logo-text, .dark .header-title, .dark .kpi-value { color: #ffffff; }
.dark .kpi-card, .dark .table-section, .dark .chart-card { background-color: #0f172a; border-color: #1e293b; }
.dark .icon-box { background-color: #1e293b; color: #64748b; }
.dark .cell-nickname { color: #f1f5f9; }
.dark :deep(.p-datatable-thead > tr > th) { background-color: rgba(15, 23, 42, 0.5) !important; color: #94a3b8 !important; }
.dark .bar-chart-container { background-color: #0f172a; border-color: #1e293b; }
.dark .map-view-container { border-color: #1e293b; }
</style>
