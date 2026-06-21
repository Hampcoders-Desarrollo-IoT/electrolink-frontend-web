<script setup>
/**
 * ServiceTrackingStepper — p-stepper para HomeOwner/Company.
 * Muestra el progreso lineal del servicio en 5 etapas:
 *   0: Programado → 1: Técnico en Camino → 2: En Ejecución
 *   → 3: Informe Registrado → 4: Completado
 */
import { computed } from 'vue';

const props = defineProps({
    /** @type {import('../../domain/models/service-order.entity.js').ServiceOrder|null} */
    service:   { type: Object,  default: null },
    isLoading: { type: Boolean, default: false },
});

const steps = [
    { label: 'Programado',        icon: 'pi pi-calendar',       description: 'Orden de servicio creada y confirmada.' },
    { label: 'Técnico en Camino', icon: 'pi pi-car',            description: 'El técnico se dirige a tu propiedad.' },
    { label: 'En Ejecución',      icon: 'pi pi-wrench',         description: 'El técnico está trabajando en el sitio.' },
    { label: 'Informe Listo',     icon: 'pi pi-file-edit',      description: 'Se ha registrado el informe técnico.' },
    { label: 'Completado',        icon: 'pi pi-check-circle',   description: 'El servicio fue finalizado exitosamente.' },
];

/** Paso activo (0-indexed) */
const activeStep = computed(() => props.service?.currentStep ?? 0);

function stepClass(index) {
    if (index < activeStep.value)  return 'sts-step--done';
    if (index === activeStep.value) return 'sts-step--active';
    return 'sts-step--pending';
}

function formatDate(date) {
    if (!date) return null;
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}

const timestamps = computed(() => {
    const s = props.service;
    return [
        s?.scheduledDate ? formatDate(s.scheduledDate) : null,
        s?.startedAt     ? formatDate(s.startedAt)     : null,
        s?.startedAt     ? formatDate(s.startedAt)     : null,
        null,
        s?.completedAt   ? formatDate(s.completedAt)   : null,
    ];
});
</script>

<template>
    <div class="sts-wrapper el-card el-shadow">
        <div class="sts-header">
            <div class="sts-title-group">
                <div class="sts-title-icon">
                    <i class="pi pi-map" />
                </div>
                <div>
                    <h3 class="sts-title">Progreso del Servicio</h3>
                    <p class="sts-subtitle">Seguimiento en tiempo real de tu orden</p>
                </div>
            </div>

            <pv-tag
                v-if="service"
                :value="service.status"
                :severity="service.statusSeverity"
                class="sts-status-tag"
            />
        </div>

        <!-- Skeleton -->
        <div v-if="isLoading" class="sts-skeleton">
            <div class="sts-skeleton-steps">
                <pv-skeleton v-for="i in 5" :key="i" width="100%" height="70px" />
            </div>
        </div>

        <!-- Stepper -->
        <div v-else class="sts-steps">
            <div
                v-for="(step, index) in steps"
                :key="index"
                class="sts-step"
                :class="stepClass(index)"
            >
                <!-- Connector line (not for last step) -->
                <div v-if="index < steps.length - 1" class="sts-connector" :class="index < activeStep ? 'sts-connector--done' : ''" />

                <!-- Step circle -->
                <div class="sts-circle">
                    <i v-if="index < activeStep"  class="pi pi-check sts-circle-icon" />
                    <i v-else :class="step.icon"  class="sts-circle-icon" />
                </div>

                <!-- Step content -->
                <div class="sts-step-content">
                    <p class="sts-step-label">{{ step.label }}</p>
                    <p class="sts-step-desc">{{ step.description }}</p>
                    <p v-if="timestamps[index]" class="sts-step-ts">
                        <i class="pi pi-clock" /> {{ timestamps[index] }}
                    </p>
                </div>
            </div>
        </div>

        <!-- Summary row when completed -->
        <div v-if="service?.isCompleted" class="sts-completion-banner">
            <i class="pi pi-check-circle sts-completion-icon" />
            <div>
                <strong>¡Servicio completado exitosamente!</strong>
                <p v-if="service.completedAt">Finalizado el {{ formatDate(service.completedAt) }}</p>
                <p v-if="service.totalCost > 0">Costo total: <strong>{{ service.formattedCost }}</strong></p>
            </div>
        </div>

        <!-- Cancelled -->
        <div v-if="service?.isCancelled" class="sts-cancelled-banner">
            <i class="pi pi-times-circle sts-cancelled-icon" />
            <div>
                <strong>Servicio cancelado</strong>
                <p v-if="service.cancelReason">Motivo: {{ service.cancelReason }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sts-wrapper {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.sts-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
}

.sts-title-group { display: flex; align-items: flex-start; gap: 0.75rem; }

.sts-title-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    background: rgba(25, 120, 229, 0.12);
    color: #1978e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.sts-title    { font-size: 1rem; font-weight: 700; color: var(--el-primary); margin: 0; }
.sts-subtitle { font-size: 0.8rem; color: var(--el-gray); margin: 0; }

.sts-skeleton-steps { display: flex; flex-direction: column; gap: 0.75rem; }

/* Steps layout */
.sts-steps {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
}

.sts-step {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    grid-template-rows: auto;
    column-gap: 1rem;
    position: relative;
    padding-bottom: 1.25rem;
}

/* Vertical connector */
.sts-connector {
    position: absolute;
    left: 1.1rem;
    top: 2.5rem;
    bottom: 0;
    width: 2px;
    background: #e5e7eb;
    z-index: 0;
}
.sts-connector--done { background: var(--el-custom); }

/* Circle */
.sts-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #e5e7eb;
    background: white;
    z-index: 1;
    transition: all 0.3s ease;
    flex-shrink: 0;
}

.sts-step--done .sts-circle {
    background: var(--el-custom);
    border-color: var(--el-custom);
    color: white;
}
.sts-step--active .sts-circle {
    background: white;
    border-color: var(--el-custom);
    color: var(--el-custom);
    box-shadow: 0 0 0 4px rgba(25, 120, 229, 0.15);
}
.sts-step--pending .sts-circle { color: #9ca3af; }

.sts-circle-icon { font-size: 0.9rem; }

/* Step content */
.sts-step-content {
    padding-top: 0.35rem;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.sts-step-label {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--el-primary);
    margin: 0;
}
.sts-step--pending .sts-step-label { color: #9ca3af; }

.sts-step-desc {
    font-size: 0.775rem;
    color: var(--el-gray);
    margin: 0;
}
.sts-step-ts {
    font-size: 0.7rem;
    color: var(--el-custom);
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

/* Completion / Cancelled banners */
.sts-completion-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.25);
    border-radius: 10px;
    padding: 0.85rem 1rem;
}
.sts-completion-icon { color: var(--el-success); font-size: 1.5rem; }
.sts-completion-banner strong { color: var(--el-success); font-size: 0.875rem; }
.sts-completion-banner p { margin: 0.15rem 0 0; font-size: 0.775rem; color: var(--el-gray); }

.sts-cancelled-banner {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
    padding: 0.85rem 1rem;
}
.sts-cancelled-icon { color: var(--el-danger); font-size: 1.5rem; }
.sts-cancelled-banner strong { color: var(--el-danger); font-size: 0.875rem; }
.sts-cancelled-banner p { margin: 0.15rem 0 0; font-size: 0.775rem; color: var(--el-gray); }
</style>
