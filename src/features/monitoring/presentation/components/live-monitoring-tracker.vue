<script setup>
/**
 * LiveMonitoringTracker — Panel superior derecho.
 *
 * Para Technician: KPIs del día (total, programados, en progreso, completados).
 * Para HomeOwner/Company: Barra de telemetría de la reparación activa con
 *   lecturas de voltaje, corriente, potencia y estado del relé.
 */
import { computed } from 'vue';

const props = defineProps({
    /** @type {'HomeOwner'|'Company'|'Technician'} */
    businessRole: { type: String, required: true },
    /** KPIs del técnico */
    dayKpis:      { type: Object,  default: () => ({ total: 0, scheduled: 0, inProgress: 0, completed: 0 }) },
    /** Telemetría para cliente/empresa */
    telemetry:    { type: Object,  default: null },
    isLoading:    { type: Boolean, default: false },
});

const isTechnician = computed(() => props.businessRole === 'Technician');

function fmt(val, unit = '', decimals = 2) {
    if (val === null || val === undefined) return '-';
    return `${Number(val).toFixed(decimals)} ${unit}`.trim();
}

const relayIcon = computed(() =>
    props.telemetry?.relayState === 'On' ? 'pi pi-bolt' : 'pi pi-ban'
);
const relayColor = computed(() =>
    props.telemetry?.relayState === 'On' ? 'var(--el-success)' : 'var(--el-danger)'
);
</script>

<template>
    <div class="lmt-card el-card el-shadow">

        <!-- ─── Skeleton ────────────────────────────────────────────── -->
        <template v-if="isLoading">
            <div class="lmt-skeleton">
                <pv-skeleton width="50%" height="1.25rem" class="mb-2" />
                <div class="lmt-skeleton-grid">
                    <pv-skeleton v-for="i in 4" :key="i" height="4rem" />
                </div>
            </div>
        </template>

        <!-- ─── Technician: KPIs del Día ────────────────────────────── -->
        <template v-else-if="isTechnician">
            <div class="lmt-header">
                <div class="lmt-icon">
                    <i class="pi pi-chart-bar" />
                </div>
                <div>
                    <h3 class="lmt-title">KPIs del Día</h3>
                    <p class="lmt-subtitle">Resumen de tu agenda</p>
                </div>
            </div>

            <div class="lmt-kpi-grid">
                <div class="lmt-kpi lmt-kpi--total">
                    <span class="lmt-kpi-value">{{ dayKpis.total }}</span>
                    <span class="lmt-kpi-label">Total</span>
                </div>
                <div class="lmt-kpi lmt-kpi--scheduled">
                    <span class="lmt-kpi-value">{{ dayKpis.scheduled }}</span>
                    <span class="lmt-kpi-label">Programados</span>
                </div>
                <div class="lmt-kpi lmt-kpi--progress">
                    <span class="lmt-kpi-value">{{ dayKpis.inProgress }}</span>
                    <span class="lmt-kpi-label">En Progreso</span>
                </div>
                <div class="lmt-kpi lmt-kpi--done">
                    <span class="lmt-kpi-value">{{ dayKpis.completed }}</span>
                    <span class="lmt-kpi-label">Completados</span>
                </div>
            </div>

            <div class="lmt-progress-section">
                <p class="lmt-progress-label">
                    Progreso del día: {{ dayKpis.total > 0 ? Math.round((dayKpis.completed / dayKpis.total) * 100) : 0 }}%
                </p>
                <pv-progress-bar
                    :value="dayKpis.total > 0 ? Math.round((dayKpis.completed / dayKpis.total) * 100) : 0"
                    class="lmt-progress-bar"
                />
            </div>
        </template>

        <!-- ─── Client / Company: Telemetría ────────────────────────── -->
        <template v-else>
            <div class="lmt-header">
                <div class="lmt-icon lmt-icon--iot">
                    <i class="pi pi-wifi" />
                </div>
                <div>
                    <h3 class="lmt-title">Telemetría IoT</h3>
                    <p class="lmt-subtitle">Lecturas del circuito en tiempo real</p>
                </div>
            </div>

            <template v-if="telemetry">
                <div class="lmt-telemetry-grid">
                    <div class="lmt-reading">
                        <i class="pi pi-bolt lmt-reading-icon" style="color:#f97316" />
                        <div>
                            <p class="lmt-reading-label">Voltaje</p>
                            <p class="lmt-reading-value">{{ fmt(telemetry.voltageV, 'V') }}</p>
                        </div>
                    </div>
                    <div class="lmt-reading">
                        <i class="pi pi-sync lmt-reading-icon" style="color:#6366f1" />
                        <div>
                            <p class="lmt-reading-label">Corriente</p>
                            <p class="lmt-reading-value">{{ fmt(telemetry.currentA, 'A') }}</p>
                        </div>
                    </div>
                    <div class="lmt-reading">
                        <i class="pi pi-chart-line lmt-reading-icon" style="color:#10b981" />
                        <div>
                            <p class="lmt-reading-label">Potencia</p>
                            <p class="lmt-reading-value">{{ fmt(telemetry.powerW, 'W') }}</p>
                        </div>
                    </div>
                    <div class="lmt-reading">
                        <i class="pi pi-wave-pulse lmt-reading-icon" style="color:#ec4899" />
                        <div>
                            <p class="lmt-reading-label">Frecuencia</p>
                            <p class="lmt-reading-value">{{ fmt(telemetry.frequencyHz, 'Hz') }}</p>
                        </div>
                    </div>
                    <div class="lmt-reading">
                        <i class="pi pi-cloud lmt-reading-icon" style="color:#1978e5" />
                        <div>
                            <p class="lmt-reading-label">Temperatura</p>
                            <p class="lmt-reading-value">{{ fmt(telemetry.temperatureC, '°C') }}</p>
                        </div>
                    </div>
                    <div class="lmt-reading">
                        <i
                            :class="relayIcon"
                            class="lmt-reading-icon"
                            :style="{ color: relayColor }"
                        />
                        <div>
                            <p class="lmt-reading-label">Estado Relé</p>
                            <p class="lmt-reading-value" :style="{ color: relayColor }">
                                {{ telemetry.relayState }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="telemetry.circuitLabel" class="lmt-circuit-badge">
                    <i class="pi pi-sitemap" />
                    {{ telemetry.circuitLabel }}
                </div>
            </template>
            <div v-else class="lmt-empty">
                <i class="pi pi-wifi lmt-empty-icon" />
                <p>Sin datos de telemetría disponibles.</p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.lmt-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 280px;
}

.lmt-skeleton { display: flex; flex-direction: column; gap: 0.5rem; }
.lmt-skeleton-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 0.5rem; }

.lmt-header { display: flex; align-items: flex-start; gap: 0.75rem; }

.lmt-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
    background: rgba(25, 120, 229, 0.12);
    color: #1978e5;
}
.lmt-icon--iot { background: rgba(16, 185, 129, 0.12); color: #10b981; }

.lmt-title    { font-size: 1rem; font-weight: 700; color: var(--el-primary); margin: 0; }
.lmt-subtitle { font-size: 0.8rem; color: var(--el-gray); margin: 0; }

/* KPI Grid */
.lmt-kpi-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.lmt-kpi {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.85rem;
    border-radius: 12px;
    gap: 0.15rem;
}
.lmt-kpi--total     { background: rgba(46, 58, 89, 0.06); }
.lmt-kpi--scheduled { background: rgba(25, 120, 229, 0.08); }
.lmt-kpi--progress  { background: rgba(249, 115, 22, 0.08); }
.lmt-kpi--done      { background: rgba(16, 185, 129, 0.08); }

.lmt-kpi-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--el-primary);
    line-height: 1;
}
.lmt-kpi-label { font-size: 0.7rem; font-weight: 600; color: var(--el-gray); text-transform: uppercase; letter-spacing: 0.04em; }

.lmt-progress-section { display: flex; flex-direction: column; gap: 0.35rem; }
.lmt-progress-label   { font-size: 0.8rem; font-weight: 600; color: var(--el-primary); margin: 0; }
.lmt-progress-bar :deep(.p-progressbar-value) { background: var(--el-custom); }

/* Telemetry Grid */
.lmt-telemetry-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
}

.lmt-reading {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.65rem;
    background: var(--el-bg-soft);
    border-radius: 10px;
}

.lmt-reading-icon { font-size: 1.1rem; margin-top: 0.1rem; }

.lmt-reading-label { font-size: 0.65rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; margin: 0; }
.lmt-reading-value { font-size: 0.95rem; font-weight: 700; color: var(--el-primary); margin: 0; }

.lmt-circuit-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: rgba(46, 58, 89, 0.06);
    border-radius: 99px;
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--el-primary);
    align-self: flex-start;
}

.lmt-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem 0;
    color: var(--el-warm-gray);
    font-size: 0.875rem;
    text-align: center;
}
.lmt-empty-icon { font-size: 2.5rem; color: var(--el-warm-gray); }
</style>
