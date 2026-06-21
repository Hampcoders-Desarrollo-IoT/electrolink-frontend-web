<script setup>
/**
 * MonitoringAlertBanner — Banners p-message para alertas.
 *
 * Para Company: muestra fallos en circuitos detectados por el snapshot IoT.
 * Para HomeOwner/Technician: muestra alertas de retraso si aplica.
 */
import { computed } from 'vue';

const props = defineProps({
    /** @type {import('../../domain/models/telemetry-log.entity.js').TelemetryLog|null} */
    telemetry:    { type: Object,  default: null },
    /** @type {import('../../domain/models/service-order.entity.js').ServiceOrder|null} */
    service:      { type: Object,  default: null },
    businessRole: { type: String,  required: true },
});

const isCompany     = computed(() => props.businessRole === 'Company');
const isTechnician  = computed(() => props.businessRole === 'Technician');

/** Alertas de anomalías IoT (Company) */
const iotAlerts = computed(() => {
    if (!isCompany.value || !props.telemetry?.hasAnomalies) return [];
    return props.telemetry.anomalies;
});

/** Alertas de retraso en el servicio */
const delayAlert = computed(() => {
    const s = props.service;
    if (!s || !s.scheduledDate || s.isCompleted || s.isCancelled) return null;
    const now  = new Date();
    const sched = new Date(s.scheduledDate);
    const diffMin = Math.round((now - sched) / 60000);
    if (diffMin > 15) return diffMin;
    return null;
});

const circuitBreakerAlert = computed(() =>
    isCompany.value && props.telemetry?.circuitBreakerTripped
);

function severityToIcon(severity) {
    const map = { Critical: 'pi pi-times-circle', High: 'pi pi-exclamation-circle', Medium: 'pi pi-exclamation-triangle', Low: 'pi pi-info-circle' };
    return map[severity] ?? 'pi pi-info-circle';
}
function severityToType(severity) {
    const map = { Critical: 'error', High: 'error', Medium: 'warn', Low: 'info' };
    return map[severity] ?? 'info';
}
</script>

<template>
    <div
        v-if="iotAlerts.length || delayAlert || circuitBreakerAlert"
        class="mab-container"
    >
        <!-- Circuit Breaker Alert -->
        <pv-message
            v-if="circuitBreakerAlert"
            severity="error"
            :closable="false"
            class="mab-message"
        >
            <div class="mab-content">
                <i class="pi pi-exclamation-circle mab-icon" />
                <div>
                    <strong>⚠️ Interruptor de circuito disparado</strong>
                    <p>El circuito <strong>{{ telemetry?.circuitLabel || 'principal' }}</strong> ha activado su interruptor de seguridad. Se requiere atención técnica inmediata.</p>
                </div>
            </div>
        </pv-message>

        <!-- IoT Anomaly Alerts -->
        <pv-message
            v-for="anomaly in iotAlerts"
            :key="anomaly.code"
            :severity="severityToType(anomaly.severity)"
            :closable="true"
            class="mab-message"
        >
            <div class="mab-content">
                <i :class="severityToIcon(anomaly.severity)" class="mab-icon" />
                <div>
                    <strong>[{{ anomaly.severity }}] {{ anomaly.code }}</strong>
                    <p>{{ anomaly.description }}</p>
                </div>
            </div>
        </pv-message>

        <!-- Delay Alert (client / technician) -->
        <pv-message
            v-if="delayAlert && !isTechnician"
            severity="warn"
            :closable="false"
            class="mab-message"
        >
            <div class="mab-content">
                <i class="pi pi-clock mab-icon" />
                <div>
                    <strong>El técnico se está demorando</strong>
                    <p>Han transcurrido <strong>{{ delayAlert }} minutos</strong> desde la hora programada. Puedes extender el tiempo de espera o cancelar el servicio.</p>
                </div>
            </div>
        </pv-message>

        <pv-message
            v-if="delayAlert && isTechnician"
            severity="warn"
            :closable="false"
            class="mab-message"
        >
            <div class="mab-content">
                <i class="pi pi-exclamation-triangle mab-icon" />
                <div>
                    <strong>Retraso detectado</strong>
                    <p>Llevas <strong>{{ delayAlert }} minutos</strong> de retraso en la atención programada. Notifica al cliente si es posible.</p>
                </div>
            </div>
        </pv-message>
    </div>
</template>

<style scoped>
.mab-container {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.mab-message :deep(.p-message) {
    border-radius: 10px;
    border-left: 4px solid;
}

.mab-content {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.mab-icon { font-size: 1.1rem; margin-top: 0.1rem; flex-shrink: 0; }

.mab-content strong { font-weight: 700; font-size: 0.875rem; color: inherit; }
.mab-content p      { margin: 0.15rem 0 0; font-size: 0.8rem; opacity: 0.85; }
</style>
