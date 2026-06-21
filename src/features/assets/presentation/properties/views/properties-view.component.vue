<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertyStore } from '../../../application/property.store.js';
import { usePropertyPortfolioStore } from '../../../application/property-portfolio.store.js';
import { useToast } from 'primevue/usetoast';

import ElButton from '@/shared/presentation/components/el-button.vue';
import ElMap from '@/shared/presentation/components/el-map.vue';
import ElChip from '@/shared/presentation/components/el-chip.vue';
import PropertyModal from '../components/property-modal.component.vue';

const propertiesStore = usePropertyStore();
const portfolioStore  = usePropertyPortfolioStore();
const router = useRouter();
const route  = useRoute();
const toast  = useToast();

const isCompanyContext = computed(() => route.name?.startsWith('assets-company'));
const activeFilter = ref('All');
const showModal = ref(false);

const ownerParam = computed(() => route.params.homeownerId || route.params.ownerId);

onMounted(() => {
    propertiesStore.loadProperties(ownerParam.value, {}, isCompanyContext.value ? 'company' : 'homeowner');
    portfolioStore.loadPortfolio(ownerParam.value);
});

function getStatusVariant(status) {
    const map = {
        'OwnerOccupied':   'success',
        'Rented':          'success',
        'Vacant':          'info',
        'UnderRenovation': 'warning',
        'Created':         'info',
        'InPortfolio':     'primary',
        'Archived':        'danger'
    };
    return map[status] || 'info';
}

function getStatusTagClass(status) {
    const map = {
        'OwnerOccupied': 'tag-occupied',
        'Rented': 'tag-occupied',
        'Vacant': 'tag-vacant',
        'UnderRenovation': 'tag-maintenance',
        'Created': 'tag-vacant',
        'InPortfolio': 'tag-full-access',
        'Archived': 'tag-vacant'
    };
    return map[status] || 'tag-vacant';
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
    return map[status] || status || 'Vacant';
}

function goToAddProperty() {
    showModal.value = true;
}

function onPropertySaved() {
    toast.add({
        severity: 'success',
        summary:  'Property Registered',
        detail:   'The new property has been successfully added.',
        life:     3000
    });
    propertiesStore.loadProperties(ownerParam.value, {}, isCompanyContext.value ? 'company' : 'homeowner');
}

function goToDashboard() {
    const routeName = isCompanyContext.value ? 'assets-company-properties-dashboard' : 'assets-homeowner-properties-dashboard';
    const paramKey = isCompanyContext.value ? 'ownerId' : 'homeownerId';
    router.push({
        name:   routeName,
        params: { [paramKey]: ownerParam.value }
    });
}

const enrichedProperties = computed(() => {
    const entries = portfolioStore.portfolio?.properties ?? [];
    let list = propertiesStore.properties.map(prop => {
        const entry = entries.find(e => e.propertyId === prop.id);
        return {
            ...prop,
            nickname:        entry?.nickname        ?? null,
            isPrimary:       entry?.isPrimary       ?? false,
            occupancyStatus: entry?.occupancyStatus ?? prop.status
        };
    });
    
    if (activeFilter.value !== 'All') {
        list = list.filter(p => (p.occupancyStatus || p.status) === activeFilter.value);
    }
    
    return list;
});

const totalCount = computed(() => propertiesStore.properties.length);

const mapMarkers = computed(() =>
    enrichedProperties.value
        .filter(p => p.geolocation?.latitude && p.geolocation?.longitude)
        .map(p => ({
            lat:   p.geolocation.latitude,
            lng:   p.geolocation.longitude,
            popup: p.nickname || p.fullAddress,
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
  <div class="properties-container">
    <main class="main-layout">
        <!-- Left Panel: Property List -->
        <aside class="property-sidebar">
            <div class="sidebar-header">
                <div class="header-top">
                    <h1 class="sidebar-title">Property Portfolio</h1>
                    <button class="add-property-btn" @click="goToAddProperty">
                        <span class="material-symbols-outlined">add</span>
                        Add Property
                    </button>
                </div>
                
                <div class="filter-pills no-scrollbar">
                    <button 
                        @click="activeFilter = 'All'" 
                        :class="['filter-btn', { active: activeFilter === 'All' }]"
                    >
                        All Assets ({{totalCount}})
                    </button>
                    <button 
                        @click="activeFilter = 'OwnerOccupied'" 
                        :class="['filter-btn', { active: activeFilter === 'OwnerOccupied' }]"
                    >
                        Owner Occupied
                    </button>
                    <button 
                        @click="activeFilter = 'Rented'" 
                        :class="['filter-btn', { active: activeFilter === 'Rented' }]"
                    >
                        Rented
                    </button>
                    <button 
                        @click="activeFilter = 'Vacant'" 
                        :class="['filter-btn', { active: activeFilter === 'Vacant' }]"
                    >
                        Vacant
                    </button>
                    <button 
                        @click="activeFilter = 'UnderRenovation'" 
                        :class="['filter-btn', { active: activeFilter === 'UnderRenovation' }]"
                    >
                        Under Renovation
                    </button>
                </div>
            </div>

            <!-- Scrollable List -->
            <div class="scrollable-list no-scrollbar">
                <div v-if="propertiesStore.isLoading || portfolioStore.isLoading" class="loading-state">
                    <i class="pi pi-spin pi-spinner spinner-icon"></i>
                </div>

                <div v-if="enrichedProperties.length === 0 && !propertiesStore.isLoading" class="empty-state">
                    <i class="pi pi-inbox empty-icon"></i>
                    <p>No properties found.</p>
                </div>

                <div v-for="prop in enrichedProperties" :key="prop.id" 
                    class="property-card"
                    :class="{'primary-border': prop.isPrimary}">
                    <div class="card-inner">
                        <div class="card-image-wrapper">
                            <div class="card-image" :style="prop.imageUrl ? { backgroundImage: `url(${prop.imageUrl})` } : {}">
                                <i v-if="!prop.imageUrl" class="pi pi-home"></i>
                            </div>
                        </div>
                        <div class="card-content">
                            <div class="content-header">
                                <h3 class="card-title">
                                    {{ prop.nickname || (prop.address?.street + ' ' + prop.address?.number) }}
                                </h3>
                                <span :class="['status-tag', getStatusTagClass(prop.occupancyStatus || prop.status)]">
                                    {{ getStatusLabel(prop.occupancyStatus || prop.status) }}
                                </span>
                            </div>
                            <p class="card-address">
                                <span class="material-symbols-outlined">location_on</span>
                                <span class="truncate-text">{{ prop.fullAddress }}</span>
                            </p>
                            
                            <div class="card-footer">
                                <div class="insights-row">
                                    <span v-if="prop.isPrimary" class="insight-item efficiency">
                                        <span class="material-symbols-outlined">bolt</span> 84% Efficiency
                                    </span>
                                    <span v-else-if="(prop.occupancyStatus || prop.status) === 'UnderRenovation'" class="insight-item alerts">
                                        <span class="material-symbols-outlined">warning</span> 2 Alerts
                                    </span>
                                    <span v-else class="insight-item features">
                                        <span class="material-symbols-outlined">electric_car</span> 4 EV Ports
                                    </span>
                                </div>
                                <span class="view-insights-link">View Insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Right Panel: Map Section -->
        <section class="map-view">
            <!-- Map UI Overlays -->
            <div class="map-overlays">
                <div class="overlay-controls top-left">
                    <div class="control-card">
                        <button class="control-btn active">
                            <span class="material-symbols-outlined">map</span>
                        </button>
                        <button class="control-btn" @click="goToDashboard">
                            <span class="material-symbols-outlined">layers</span>
                        </button>
                    </div>
                </div>

                <div class="overlay-controls top-right">
                    <div class="control-card vertical">
                        <button class="control-btn">
                            <span class="material-symbols-outlined">add</span>
                        </button>
                        <button class="control-btn">
                            <span class="material-symbols-outlined">remove</span>
                        </button>
                    </div>
                </div>

                <!-- Floating Legend -->
                <div class="map-legend-card">
                    <h4 class="legend-header">Resource Status</h4>
                    <div class="legend-list">
                        <div class="legend-row">
                            <div class="label-with-dot">
                                <div class="status-dot success"></div>
                                <span>Active Monitoring</span>
                            </div>
                            <span class="status-value">85%</span>
                        </div>
                        <div class="legend-row">
                            <div class="label-with-dot">
                                <div class="status-dot warning"></div>
                                <span>Maintenance Window</span>
                            </div>
                            <span class="status-value">12%</span>
                        </div>
                        <div class="legend-row">
                            <div class="label-with-dot">
                                <div class="status-dot danger"></div>
                                <span>System Outage</span>
                            </div>
                            <span class="status-value">3%</span>
                        </div>
                    </div>
                </div>
            </div>

            <el-map
                :markers="mapMarkers"
                :center="selectedCenter"
                :zoom="13"
                height="100%"
                class="full-map-component"
            />
        </section>
    </main>

    <property-modal
        v-model="showModal"
        :homeowner-id="ownerParam"
        :context="isCompanyContext ? 'company' : 'homeowner'"
        @save="onPropertySaved"
    />
  </div>
</template>

<style scoped>
.properties-container {
    position: relative;
    display: flex;
    height: 100vh;
    width: 100%;
    flex-direction: column;
    overflow: hidden;
    background-color: #f8f6f6;
    font-family: 'Public Sans', sans-serif;
    color: #0f172a;
}

.main-layout {
    display: flex;
    flex: 1;
    overflow: hidden;
}

/* Sidebar */
.property-sidebar {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background-color: #ffffff;
    border-right: 1px solid #e2e8f0;
    z-index: 10;
}

@media (min-width: 768px) {
    .property-sidebar { width: 450px; }
}

@media (min-width: 1024px) {
    .property-sidebar { width: 500px; }
}

.sidebar-header {
    padding: 1.5rem;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidebar-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
}

.add-property-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #2E3A59;
    color: #ffffff;
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.add-property-btn:hover {
    background-color: rgba(46, 58, 89, 0.9);
}

.add-property-btn .material-symbols-outlined {
    font-size: 1rem;
}

/* Filters */
.filter-pills {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.25rem;
}

.filter-btn {
    padding: 0.375rem 1rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
    transition: all 0.2s;
    background-color: #f1f5f9;
    color: #64748b;
    border: none;
    cursor: pointer;
}

.filter-btn:hover {
    background-color: #e2e8f0;
}

.filter-btn.active {
    background-color: #2E3A59;
    color: #ffffff;
}

/* List */
.scrollable-list {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background-color: rgba(232, 238, 247, 0.3);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

/* Cards */
.property-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 0.75rem;
    overflow: hidden;
    transition: all 0.3s;
    cursor: pointer;
    position: relative;
}

.property-card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.primary-border {
    border-left: 4px solid #2E3A59;
}

.card-inner {
    display: flex;
    padding: 1rem;
    gap: 1rem;
}

.card-image-wrapper {
    flex-shrink: 0;
}

.card-image {
    height: 6rem;
    width: 6rem;
    border-radius: 0.5rem;
    background-color: #f4f6f8;
    background-size: cover;
    background-position: center;
    border: 1px solid #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-image i {
    font-size: 2rem;
    color: #cbd5e1;
}

.card-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
}

.content-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.card-title {
    font-weight: 700;
    font-size: 1.125rem;
    color: #2E3A59;
    margin: 0;
}

.status-tag {
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.tag-occupied { background-color: #dcfce7; color: #15803d; }
.tag-vacant { background-color: #f1f5f9; color: #475569; }
.tag-maintenance { background-color: #fef3c7; color: #b45309; }
.tag-full-access { background-color: rgba(46, 58, 89, 0.1); color: #2E3A59; }

.card-address {
    font-size: 0.875rem;
    color: #64748b;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    margin: 0.25rem 0 0.5rem 0;
}

.card-address .material-symbols-outlined {
    font-size: 1rem;
}

.truncate-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.insights-row {
    display: flex;
    gap: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #64748b;
}

.insight-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.insight-item .material-symbols-outlined {
    font-size: 0.875rem;
}

.insight-item.efficiency { color: #3b82f6; }
.insight-item.alerts { color: #ef4444; }

.view-insights-link {
    font-size: 0.875rem;
    font-weight: 700;
    color: #2E3A59;
}

/* Map Section */
.map-view {
    display: none;
    flex: 1;
    position: relative;
    background-color: #E8EEF7;
}

@media (min-width: 768px) {
    .map-view { display: block; }
}

.map-overlays {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 100;
}

.overlay-controls {
    position: absolute;
    pointer-events: auto;
}

.top-left { top: 1rem; left: 1rem; }
.top-right { top: 1rem; right: 1rem; }

.control-card {
    background-color: #ffffff;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-radius: 0.75rem;
    padding: 0.5rem;
    display: flex;
    gap: 0.5rem;
    border: 1px solid #e2e8f0;
}

.control-card.vertical {
    flex-direction: column;
}

.control-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;
    color: #64748b;
}

.control-btn:hover {
    background-color: #f1f5f9;
}

.control-btn.active {
    background-color: #2E3A59;
    color: #ffffff;
}

.map-legend-card {
    position: absolute;
    bottom: 1.5rem;
    right: 1.5rem;
    pointer-events: auto;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    padding: 1.25rem;
    border-radius: 0.75rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 280px;
}

.legend-header {
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
    color: #94a3b8;
    letter-spacing: 0.1em;
    margin: 0 0 1rem 0;
}

.legend-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.legend-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.label-with-dot {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.label-with-dot span {
    font-size: 0.75rem;
    font-weight: 600;
    color: #0f172a;
}

.status-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
}

.status-dot.success { background-color: #22c55e; }
.status-dot.warning { background-color: #f59e0b; }
.status-dot.danger { background-color: #ef4444; }

.status-value {
    font-size: 0.75rem;
    font-weight: 700;
    color: #2E3A59;
}

.full-map-component {
    width: 100%;
    height: 100%;
}

/* Utilities */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Dark Mode Overrides */
.dark .properties-container { background-color: #221610; color: #f1f5f9; }
.dark .property-sidebar { background-color: #221610; border-color: #334155; }
.dark .sidebar-header { border-color: #334155; }
.dark .sidebar-title { color: #f1f5f9; }
.dark .filter-btn { background-color: #334155; color: #94a3b8; }
.dark .filter-btn.active { background-color: #2E3A59; color: #ffffff; }
.dark .scrollable-list { background-color: rgba(15, 23, 42, 0.5); }
.dark .property-card { background-color: #0f172a; border-color: #334155; }
.dark .card-title { color: #f1f5f9; }
.dark .status-tag.tag-occupied { background-color: rgba(21, 128, 61, 0.2); color: #4ade80; }
.dark .status-tag.tag-vacant { background-color: #334155; color: #94a3b8; }
.dark .status-tag.tag-maintenance { background-color: rgba(180, 83, 9, 0.2); color: #fbbf24; }
.dark .view-insights-link { color: #ec5b13; }
.dark .map-view { background-color: #0f172a; }
.dark .control-card { background-color: #0f172a; border-color: #334155; }
.dark .map-legend-card { background-color: rgba(15, 23, 42, 0.9); border-color: #334155; }
.dark .label-with-dot span { color: #f1f5f9; }
.dark .status-value { color: #f1f5f9; }
</style>
