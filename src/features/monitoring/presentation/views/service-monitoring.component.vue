<script setup>
/**
 * ServiceMonitoringComponent — Vista contenedora principal.
 *
 * Orquesta la UI de forma dinámica/polimórfica basada en el rol de negocio del
 * usuario (BusinessRole: Technician, HomeOwner o Company).
 *
 * REGLAS DE ACCESO:
 *  - Solo los usuarios con accessRole === 'USER' pueden acceder.
 *  - ADMIN y SUPERADMIN son bloqueados y redirigidos.
 */
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useMonitoringStore }  from '../../application/monitoring.store.js';
import { useProfilesStore }    from '../../../profiles/application/profiles.store.js';
import useIamStore             from '../../../iam/application/iam.store.js';

import ActiveServiceCard        from '../components/active-service-card.vue';
import LiveMonitoringTracker    from '../components/live-monitoring-tracker.vue';
import MonitoringAlertBanner    from '../components/monitoring-alert-banner.vue';
import ServiceTrackingStepper   from '../components/service-tracking-stepper.vue';
import ServiceHistoryTable      from '../components/service-history-table.vue';

// ─── Stores & router ───────────────────────────────────────────────────────────
const router          = useRouter();
const iamStore        = useIamStore();
const profilesStore   = useProfilesStore();
const monitoringStore = useMonitoringStore();

// ─── Profile-derived data ─────────────────────────────────────────────────────
const profile       = computed(() => profilesStore.profile);
const businessRole  = computed(() => profile.value?.businessRole ?? null);
// roleSubjectId is the technician/homeowner/company domain ID from the JWT
const roleSubjectId = computed(() => iamStore.roleSubjectId ?? null);

const isTechnician  = computed(() => businessRole.value === 'TECHNICIAN' || roleSubjectId.value?.startsWith('tech-'));
const isHomeOwner   = computed(() => businessRole.value === 'HOMEOWNER' || roleSubjectId.value?.startsWith('home-'));
const isCompany     = computed(() => businessRole.value === 'COMPANY');
const isClientRole  = computed(() => isHomeOwner.value || isCompany.value);

// Normalised role label for child components (match their prop expectations)
const normalisedRole = computed(() => {
    if (isTechnician.value) return 'Technician';
    if (isCompany.value)    return 'Company';
    return 'HomeOwner';
});

// ─── Access control ───────────────────────────────────────────────────────────
const accessDenied  = computed(() => {
    const role = iamStore.currentAccessRole;
    return role === 'ADMIN' || role === 'SUPERADMIN';
});

// ─── Local UI state ───────────────────────────────────────────────────────────
const isAvailable        = ref(true);
const showCancelDialog   = ref(false);
const cancelForm         = ref({ reason: '', notes: '', requestReassignment: false });
const showCompleteDialog = ref(false);
const completeForm       = ref({ reportContent: '', findings: '', recommendations: '', iotFindings: '' });

// ─── Store bindings ────────────────────────────────────────────────────────────
const activeService     = computed(() => monitoringStore.activeServiceOrder);
const technicianDayList = computed(() => monitoringStore.technicianDayList);
const serviceHistory    = computed(() => monitoringStore.serviceHistory);
const telemetry         = computed(() => monitoringStore.telemetry);
const dayKpis           = computed(() => monitoringStore.dayKpis);
const isLoading         = computed(() => monitoringStore.isLoading);
const isActionLoading   = computed(() => monitoringStore.isActionLoading);

// ─── Leaflet Map (Technician only) ────────────────────────────────────────────
const mapContainer    = ref(null);
let   leafletMap      = null;
let   routePolyline   = null;
const mapReady        = ref(false);
let   mapInitPromise  = null;

async function initLeafletMap() {
    if (!mapContainer.value || leafletMap) return;
    if (mapInitPromise) return mapInitPromise;

    mapInitPromise = (async () => {
        const container = mapContainer.value;
        container.innerHTML = '';

        const L = (await import('leaflet')).default;
        await import('leaflet/dist/leaflet.css');

        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
            iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        leafletMap = L.map(container, {
            center: [-12.0464, -77.0428],
            zoom: 13,
            zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
        }).addTo(leafletMap);

        const markers = [];
        technicianDayList.value.forEach((svc, idx) => {
            if (!svc.latitude && !svc.longitude) return;
            const color = svc.isInProgress ? '#1978e5' : svc.isCompleted ? '#10b981' : '#ffe492';
            const icon = L.divIcon({
                html: `<div style="
                    width:32px;height:32px;border-radius:50% 50% 50% 0;
                    background:${color};border:2px solid white;
                    box-shadow:0 2px 6px rgba(0,0,0,0.3);
                    display:flex;align-items:center;justify-content:center;
                    color:white;font-weight:700;font-size:12px;
                    transform:rotate(-45deg)">
                        <span style="transform:rotate(45deg)">${idx + 1}</span>
                    </div>`,
                className: '',
                iconSize: [32, 32],
                iconAnchor: [16, 32],
            });
            const marker = L.marker([svc.latitude, svc.longitude], { icon })
                .bindPopup(`<b>${svc.propertyAddress || 'Propiedad'}</b><br>${svc.clientName || ''}<br><em>${svc.status}</em>`)
                .addTo(leafletMap);
            markers.push(marker);
        });

        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            leafletMap.fitBounds(group.getBounds().pad(0.2));
        }

        mapReady.value = true;
        mapInitPromise = null;
    })();

    return mapInitPromise;
}

function destroyMap() {
    mapInitPromise = null;
    if (leafletMap) {
        leafletMap.remove();
        leafletMap = null;
    }
    if (mapContainer.value) {
        mapContainer.value.innerHTML = '';
    }
    mapReady.value = false;
}

// ─── Event handlers ───────────────────────────────────────────────────────────

async function handleStartService(executionId) {
    await monitoringStore.startService(executionId);
}

async function handleCancelService(executionId) {
    const payload = {
        cancelledBy:        isClientRole.value ? 'Client' : 'Technician',
        reason:             cancelForm.value.reason,
        notes:              cancelForm.value.notes,
        requestReassignment: cancelForm.value.requestReassignment,
    };
    const ok = await monitoringStore.cancelService(executionId, payload);
    if (ok) {
        showCancelDialog.value = false;
        cancelForm.value = { reason: '', notes: '', requestReassignment: false };
    }
}

async function handleExtendWait({ executionId, minutes }) {
    await monitoringStore.extendWait(executionId, minutes);
}

async function handleCompleteService() {
    if (!activeService.value) return;
    const id = activeService.value.executionId;
    const ok = await monitoringStore.updateReport(id, completeForm.value);
    if (!ok) return;
    const done = await monitoringStore.completeService(id);
    if (done) {
        showCompleteDialog.value = false;
        completeForm.value = { reportContent: '', findings: '', recommendations: '', iotFindings: '' };
        if (isTechnician.value && roleSubjectId.value) {
            await monitoringStore.loadServiceHistory('technician', roleSubjectId.value);
        }
    }
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(async () => {
    // Block ADMIN / SUPERADMIN
    if (accessDenied.value) {
        router.push({ name: 'home' });
        return;
    }

    // Ensure profile is loaded (always reload if businessRole is missing)
    if (iamStore.currentUserId && (!profile.value || !profile.value.businessRole)) {
        await profilesStore.loadProfile(iamStore.currentUserId);
    }

    if (!roleSubjectId.value) return;

    console.log('[MonitoringView] roleSubjectId:', roleSubjectId.value, 'businessRole:', businessRole.value, 'isTechnician:', isTechnician.value, 'profile:', profile.value);

    if (isTechnician.value) {
        await Promise.all([
            monitoringStore.loadTechnicianDayList(roleSubjectId.value),
            monitoringStore.loadServiceHistory('technician', roleSubjectId.value),
        ]);
        await nextTick();
        await initLeafletMap();
    } else {
        // HomeOwner or Company
        await monitoringStore.loadClientActiveService(roleSubjectId.value);
        await monitoringStore.loadServiceHistory('homeowner', roleSubjectId.value);

        if (activeService.value?.executionId) {
            await monitoringStore.loadIotContext(activeService.value.executionId);
        }
    }
});

// Re-init map if day list changes
watch(technicianDayList, async () => {
    if (isTechnician.value) {
        destroyMap();
        await nextTick();
        await initLeafletMap();
    }
});

onBeforeUnmount(() => {
    destroyMap();
});
</script>

<template>
    <div class="sm-layout">

        <!-- ─── Access Denied Overlay ──────────────────────────────── -->
        <div v-if="accessDenied" class="sm-access-denied">
            <div class="sm-denied-card el-card el-shadow">
                <i class="pi pi-lock sm-denied-icon" />
                <h2>Acceso Restringido</h2>
                <p>Este módulo no está disponible para tu rol de acceso.</p>
                <pv-button label="Ir al Inicio" icon="pi pi-home" @click="router.push({ name: 'home' })" />
            </div>
        </div>

        <template v-else>
            <!-- ─── Page Header ────────────────────────────────────── -->
            <header class="sm-page-header">
                <div class="sm-page-header-left">
                    <div class="sm-header-icon">
                        <i :class="isTechnician ? 'pi pi-wrench' : 'pi pi-bolt'" />
                    </div>
                    <div>
                        <h1 class="sm-page-title">
                            {{ isTechnician ? 'Panel del Técnico' : 'Monitoreo de Servicio' }}
                        </h1>
                        <p class="sm-page-subtitle">
                            <template v-if="isTechnician">Agenda del día, rutas y disponibilidad</template>
                            <template v-else-if="isCompany">Seguimiento de orden activa y alertas IoT de circuitos</template>
                            <template v-else>Seguimiento en tiempo real de tu orden de servicio</template>
                        </p>
                    </div>
                </div>

                <div class="sm-page-header-right">
                    <pv-tag
                        v-if="businessRole"
                        :value="normalisedRole"
                        severity="info"
                        class="sm-role-badge"
                    />
                    <!-- Complete service action (Technician) -->
                    <pv-button
                        v-if="isTechnician && activeService?.canComplete"
                        id="btn-complete-service"
                        label="Completar Servicio"
                        icon="pi pi-check"
                        severity="success"
                        @click="showCompleteDialog = true"
                    />
                </div>
            </header>

            <!-- ─── Alert Banners ──────────────────────────────────── -->
            <MonitoringAlertBanner
                :telemetry="telemetry"
                :service="activeService"
                :business-role="normalisedRole"
            />

            <!-- ═══════════════════════════════════════════════════════
                 TECHNICIAN LAYOUT
                 ═══════════════════════════════════════════════════════ -->
            <template v-if="isTechnician">
                <!-- Top row: Availability + KPIs -->
                <div class="sm-top-row">
                    <ActiveServiceCard
                        :business-role="normalisedRole"
                        :service="technicianDayList.find(s => s.isInProgress) ?? null"
                        :is-loading="isLoading"
                        v-model:is-available="isAvailable"
                        @start-service="handleStartService"
                        @cancel-service="(id) => { showCancelDialog = true; }"
                    />
                    <LiveMonitoringTracker
                        :business-role="normalisedRole"
                        :day-kpis="dayKpis"
                        :is-loading="isLoading"
                    />
                </div>

                <!-- Map Section -->
                <div class="sm-map-section el-card el-shadow">
                    <div class="sm-map-header">
                        <div class="sm-map-icon">
                            <i class="pi pi-map-marker" />
                        </div>
                        <div>
                            <h3 class="sm-section-title">Mapa de Servicios del Día</h3>
                            <p class="sm-section-subtitle">Rutas de viaje y ubicaciones de atención</p>
                        </div>
                    </div>
                    <div ref="mapContainer" class="sm-map-container" />
                    <div v-if="!mapReady && isLoading" class="sm-map-skeleton">
                        <pv-skeleton width="100%" height="100%" />
                    </div>
                </div>

                <!-- Day Schedule List -->
                <div class="sm-schedule-section el-card el-shadow">
                    <div class="sm-map-header">
                        <div class="sm-schedule-icon">
                            <i class="pi pi-calendar" />
                        </div>
                        <div>
                            <h3 class="sm-section-title">Agenda del Día</h3>
                            <p class="sm-section-subtitle">{{ dayKpis.total }} servicio(s) asignado(s)</p>
                        </div>
                    </div>
                    <div v-if="isLoading" class="sm-schedule-skeleton">
                        <pv-skeleton v-for="i in 3" :key="i" height="70px" />
                    </div>
                    <div v-else-if="technicianDayList.length === 0" class="sm-empty-schedule">
                        <i class="pi pi-calendar-times" />
                        <p>No tienes servicios asignados para hoy.</p>
                    </div>
                    <div v-else class="sm-schedule-list">
                        <div
                            v-for="(svc, idx) in technicianDayList"
                            :key="svc.executionId"
                            class="sm-schedule-item"
                            :class="{ 'sm-schedule-item--active': svc.isInProgress }"
                        >
                            <div class="sm-schedule-num">{{ idx + 1 }}</div>
                            <div class="sm-schedule-info">
                                <div class="sm-schedule-top">
                                    <span class="sm-schedule-address">{{ svc.propertyAddress || 'Dirección no disponible' }}</span>
                                    <pv-tag
                                        :value="svc.status"
                                        :severity="svc.statusSeverity"
                                        class="sm-schedule-status"
                                    />
                                </div>
                                <div class="sm-schedule-meta">
                                    <span><i class="pi pi-user" /> {{ svc.clientName || '-' }}</span>
                                    <span><i class="pi pi-clock" /> {{ svc.scheduledTime || '-' }}</span>
                                    <span><i class="pi pi-wrench" /> {{ svc.serviceType || '-' }}</span>
                                </div>
                            </div>
                            <div v-if="svc.canStart" class="sm-schedule-action">
                                <pv-button
                                    :id="`btn-start-${svc.executionId}`"
                                    icon="pi pi-play"
                                    size="small"
                                    rounded
                                    :loading="isActionLoading"
                                    @click="handleStartService(svc.executionId)"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- ═══════════════════════════════════════════════════════
                 HOMEOWNER / COMPANY LAYOUT
                 ═══════════════════════════════════════════════════════ -->
            <template v-else>
                <!-- Top row: Service details + Telemetry -->
                <div class="sm-top-row">
                    <ActiveServiceCard
                        :business-role="normalisedRole"
                        :service="activeService"
                        :is-loading="isLoading"
                        @cancel-service="(id) => { showCancelDialog = true; }"
                        @extend-wait="handleExtendWait"
                    />
                    <LiveMonitoringTracker
                        :business-role="normalisedRole"
                        :telemetry="telemetry"
                        :is-loading="isLoading"
                    />
                </div>

                <!-- Progress Stepper -->
                <ServiceTrackingStepper
                    :service="activeService"
                    :is-loading="isLoading"
                />
            </template>

            <!-- ─── Service History Table (all roles) ────────────── -->
            <ServiceHistoryTable
                :history="serviceHistory"
                :is-loading="isLoading"
                :business-role="normalisedRole"
            />

            <!-- ═══════════════════════════════════════════════════════
                 DIALOGS
                 ═══════════════════════════════════════════════════════ -->

            <!-- Cancel Service Dialog -->
            <pv-dialog
                v-model:visible="showCancelDialog"
                header="Cancelar Servicio"
                :modal="true"
                :draggable="false"
                class="sm-dialog"
                style="width: min(500px, 96vw)"
            >
                <div class="sm-dialog-body">
                    <pv-message severity="warn" :closable="false">
                        Esta acción no se puede deshacer. El servicio será marcado como cancelado.
                    </pv-message>

                    <div class="sm-form-field">
                        <label class="sm-field-label">Motivo de cancelación *</label>
                        <pv-input-text
                            v-model="cancelForm.reason"
                            placeholder="Ej. El técnico no se presentó..."
                            class="sm-input"
                        />
                    </div>
                    <div class="sm-form-field">
                        <label class="sm-field-label">Notas adicionales</label>
                        <pv-textarea
                            v-model="cancelForm.notes"
                            :rows="3"
                            placeholder="Detalles adicionales..."
                            class="sm-input"
                        />
                    </div>
                    <div class="sm-form-check">
                        <pv-checkbox v-model="cancelForm.requestReassignment" :binary="true" input-id="reassign" />
                        <label for="reassign" class="sm-check-label">Solicitar reasignación de técnico</label>
                    </div>
                </div>
                <template #footer>
                    <pv-button label="Volver" severity="secondary" outlined @click="showCancelDialog = false" />
                    <pv-button
                        label="Confirmar Cancelación"
                        severity="danger"
                        :loading="isActionLoading"
                        :disabled="!cancelForm.reason.trim()"
                        @click="handleCancelService(activeService?.executionId)"
                    />
                </template>
            </pv-dialog>

            <!-- Complete Service Dialog (Technician) -->
            <pv-dialog
                v-if="isTechnician"
                v-model:visible="showCompleteDialog"
                header="Completar y Cerrar Servicio"
                :modal="true"
                :draggable="false"
                class="sm-dialog"
                style="width: min(600px, 96vw)"
            >
                <div class="sm-dialog-body">
                    <pv-message severity="info" :closable="false">
                        Una vez completado, el servicio quedará cerrado de forma irreversible. Asegúrate de haber subido todas las fotos requeridas.
                    </pv-message>

                    <div class="sm-form-field">
                        <label class="sm-field-label">Contenido del Informe *</label>
                        <pv-textarea v-model="completeForm.reportContent" :rows="4" placeholder="Describe el trabajo realizado..." class="sm-input" />
                    </div>
                    <div class="sm-form-field">
                        <label class="sm-field-label">Hallazgos</label>
                        <pv-textarea v-model="completeForm.findings" :rows="3" placeholder="Hallazgos técnicos..." class="sm-input" />
                    </div>
                    <div class="sm-form-field">
                        <label class="sm-field-label">Recomendaciones</label>
                        <pv-textarea v-model="completeForm.recommendations" :rows="3" placeholder="Recomendaciones para el cliente..." class="sm-input" />
                    </div>
                    <div class="sm-form-field">
                        <label class="sm-field-label">Hallazgos IoT</label>
                        <pv-textarea v-model="completeForm.iotFindings" :rows="3" placeholder="Observaciones de los sensores IoT..." class="sm-input" />
                    </div>
                </div>
                <template #footer>
                    <pv-button label="Cancelar" severity="secondary" outlined @click="showCompleteDialog = false" />
                    <pv-button
                        label="Cerrar Orden de Trabajo"
                        severity="success"
                        icon="pi pi-check"
                        :loading="isActionLoading"
                        :disabled="!completeForm.reportContent.trim()"
                        @click="handleCompleteService"
                    />
                </template>
            </pv-dialog>
        </template>
    </div>
</template>

<style scoped>
/* ─── Layout ───────────────────────────────────────────────────────────────── */
.sm-layout {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 2rem;
    max-width: 90rem;
    margin: 0 auto;
    min-height: 100vh;
    background-color: var(--el-bg-soft);
}

/* ─── Access denied ────────────────────────────────────────────────────────── */
.sm-access-denied {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}
.sm-denied-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem;
    text-align: center;
}
.sm-denied-icon { font-size: 4rem; color: var(--el-danger); }

/* ─── Page Header ──────────────────────────────────────────────────────────── */
.sm-page-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    background: white;
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    border: 1px solid rgba(169, 177, 186, 0.2);
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.06);
}

.sm-page-header-left  { display: flex; align-items: flex-start; gap: 0.875rem; }
.sm-page-header-right { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

.sm-header-icon {
    width: 3rem;
    height: 3rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #1978e5 0%, #2e3a59 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(25, 120, 229, 0.3);
}

.sm-page-title    { font-size: 1.375rem; font-weight: 800; color: var(--el-primary); margin: 0; }
.sm-page-subtitle { font-size: 0.825rem; color: var(--el-gray); margin: 0; }
.sm-role-badge    { font-size: 0.75rem; }

/* ─── Top Row (two-column panels) ──────────────────────────────────────────── */
.sm-top-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
}

@media (max-width: 768px) {
    .sm-layout  { padding: 1rem; gap: 1rem; }
    .sm-top-row { grid-template-columns: 1fr; }
}

/* ─── Map Section ──────────────────────────────────────────────────────────── */
.sm-map-section {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.sm-map-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}
.sm-map-icon, .sm-schedule-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.sm-map-icon      { background: rgba(25, 120, 229, 0.12); color: #1978e5; }
.sm-schedule-icon { background: rgba(46, 58, 89, 0.08); color: var(--el-primary); }

.sm-section-title    { font-size: 1rem; font-weight: 700; color: var(--el-primary); margin: 0; }
.sm-section-subtitle { font-size: 0.8rem; color: var(--el-gray); margin: 0; }

.sm-map-container {
    width: 100%;
    height: 380px;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(169, 177, 186, 0.2);
    z-index: 0;
}
.sm-map-skeleton {
    width: 100%;
    height: 380px;
    border-radius: 10px;
    overflow: hidden;
}

/* ─── Schedule List ────────────────────────────────────────────────────────── */
.sm-schedule-section {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.sm-schedule-skeleton { display: flex; flex-direction: column; gap: 0.75rem; }
.sm-empty-schedule {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1.5rem;
    color: var(--el-warm-gray);
    font-size: 0.875rem;
}
.sm-schedule-list { display: flex; flex-direction: column; gap: 0.75rem; }

.sm-schedule-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(169, 177, 186, 0.15);
    background: white;
    transition: box-shadow 0.2s ease;
}
.sm-schedule-item:hover { box-shadow: 0 4px 12px rgba(46, 58, 89, 0.08); }
.sm-schedule-item--active {
    border-color: rgba(25, 120, 229, 0.4);
    background: rgba(25, 120, 229, 0.03);
}

.sm-schedule-num {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: var(--el-bg-soft);
    color: var(--el-primary);
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.sm-schedule-info  { flex: 1; display: flex; flex-direction: column; gap: 0.35rem; }
.sm-schedule-top   { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap; }
.sm-schedule-address { font-size: 0.875rem; font-weight: 600; color: var(--el-primary); }
.sm-schedule-status  { font-size: 0.65rem; }

.sm-schedule-meta {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.775rem;
    color: var(--el-gray);
    flex-wrap: wrap;
}
.sm-schedule-meta i { font-size: 0.7rem; color: var(--el-custom); }

.sm-schedule-action { display: flex; align-items: center; }

/* ─── Dialogs ──────────────────────────────────────────────────────────────── */
.sm-dialog-body    { display: flex; flex-direction: column; gap: 1rem; padding: 0.25rem 0; }
.sm-form-field     { display: flex; flex-direction: column; gap: 0.3rem; }
.sm-field-label    { font-size: 0.75rem; font-weight: 700; color: var(--el-primary); text-transform: uppercase; letter-spacing: 0.04em; }
.sm-input          { width: 100%; }

.sm-form-check     { display: flex; align-items: center; gap: 0.5rem; }
.sm-check-label    { font-size: 0.875rem; color: var(--el-primary); cursor: pointer; }
</style>
