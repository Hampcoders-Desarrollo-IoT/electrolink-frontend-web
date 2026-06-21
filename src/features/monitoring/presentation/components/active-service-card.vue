<script setup>
/**
 * ActiveServiceCard — Panel superior izquierdo.
 *
 * Para HomeOwner/Company: muestra los detalles del servicio activo.
 * Para Technician: muestra su disponibilidad con pv-toggle-button y
 *   los datos del servicio que está atendiendo actualmente.
 */
import { computed } from 'vue';

const props = defineProps({
    /** @type {'HomeOwner'|'Company'|'Technician'} */
    businessRole: { type: String, required: true },
    /** @type {import('../../domain/models/service-order.entity.js').ServiceOrder|null} */
    service:      { type: Object, default: null },
    isLoading:    { type: Boolean, default: false },
    /** Solo Technician */
    isAvailable:  { type: Boolean, default: true },
});

const emit = defineEmits(['update:isAvailable', 'start-service', 'cancel-service', 'extend-wait']);

const isTechnician  = computed(() => props.businessRole === 'Technician');
const isClient      = computed(() => !isTechnician.value);

const availabilityLabel = computed(() =>
    props.isAvailable ? 'Activo' : 'Inactivo'
);

const statusSeverityMap = {
    Scheduled:  'info',
    InProgress: 'warn',
    Completed:  'success',
    Cancelled:  'danger',
};

function getStatusSeverity(status) {
    return statusSeverityMap[status] ?? 'secondary';
}

function formatDate(date) {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date));
}
</script>

<template>
    <div class="asc-card el-card el-shadow">
        <!-- ─── Skeleton ────────────────────────────────────────────── -->
        <template v-if="isLoading">
            <div class="asc-skeleton">
                <pv-skeleton width="60%" height="1.25rem" class="mb-2" />
                <pv-skeleton width="40%" height="1rem" class="mb-3" />
                <pv-skeleton width="100%" height="4rem" class="mb-2" />
                <pv-skeleton width="80%" height="1rem" />
            </div>
        </template>

        <!-- ─── Technician View ─────────────────────────────────────── -->
        <template v-else-if="isTechnician">
            <div class="asc-header">
                <div class="asc-icon asc-icon--tech">
                    <i class="pi pi-wrench" />
                </div>
                <div>
                    <h3 class="asc-title">Estado del Técnico</h3>
                    <p class="asc-subtitle">Gestiona tu disponibilidad del día</p>
                </div>
            </div>

            <div class="asc-availability-row">
                <span class="asc-label">Disponibilidad:</span>
                <pv-toggle-button
                    :model-value="isAvailable"
                    :on-label="availabilityLabel"
                    :off-label="availabilityLabel"
                    on-icon="pi pi-check-circle"
                    off-icon="pi pi-times-circle"
                    class="asc-toggle"
                    @update:model-value="emit('update:isAvailable', $event)"
                />
            </div>

            <pv-divider />

            <template v-if="service">
                <div class="asc-current-service">
                    <div class="asc-info-row">
                        <i class="pi pi-map-marker asc-row-icon" />
                        <div>
                            <p class="asc-detail-label">Dirección</p>
                            <p class="asc-detail-value">{{ service.propertyAddress || '-' }}</p>
                        </div>
                    </div>
                    <div class="asc-info-row">
                        <i class="pi pi-user asc-row-icon" />
                        <div>
                            <p class="asc-detail-label">Cliente</p>
                            <p class="asc-detail-value">{{ service.clientName || '-' }}</p>
                        </div>
                    </div>
                    <div class="asc-info-row">
                        <i class="pi pi-clock asc-row-icon" />
                        <div>
                            <p class="asc-detail-label">Programado</p>
                            <p class="asc-detail-value">{{ formatDate(service.scheduledDate) }}</p>
                        </div>
                    </div>
                    <div class="asc-status-row">
                        <pv-tag
                            :value="service.status"
                            :severity="getStatusSeverity(service.status)"
                        />
                    </div>
                    <div v-if="service.canStart" class="asc-actions">
                        <pv-button
                            id="btn-start-service"
                            label="Iniciar Servicio"
                            icon="pi pi-play"
                            class="asc-btn-start"
                            @click="emit('start-service', service.executionId)"
                        />
                    </div>
                </div>
            </template>
            <div v-else class="asc-empty">
                <i class="pi pi-calendar-times asc-empty-icon" />
                <p>No tienes servicios en curso actualmente.</p>
            </div>
        </template>

        <!-- ─── Client / Company View ───────────────────────────────── -->
        <template v-else>
            <div class="asc-header">
                <div class="asc-icon asc-icon--client">
                    <i class="pi pi-bolt" />
                </div>
                <div>
                    <h3 class="asc-title">Servicio Activo</h3>
                    <p class="asc-subtitle">Detalles de tu orden en curso</p>
                </div>
            </div>

            <template v-if="service">
                <div class="asc-client-grid">
                    <div class="asc-data-item">
                        <span class="asc-label">Técnico Asignado</span>
                        <p class="asc-value">{{ service.technicianName || 'Asignando...' }}</p>
                    </div>
                    <div class="asc-data-item">
                        <span class="asc-label">Tipo de Servicio</span>
                        <p class="asc-value">{{ service.serviceType || '-' }}</p>
                    </div>
                    <div class="asc-data-item">
                        <span class="asc-label">Fecha Programada</span>
                        <p class="asc-value">{{ formatDate(service.scheduledDate) }}</p>
                    </div>
                    <div class="asc-data-item">
                        <span class="asc-label">Propiedad</span>
                        <p class="asc-value">{{ service.propertyAddress || '-' }}</p>
                    </div>
                    <div class="asc-data-item asc-data-item--full">
                        <span class="asc-label">Estado</span>
                        <pv-tag
                            :value="service.status"
                            :severity="getStatusSeverity(service.status)"
                        />
                    </div>
                </div>

                <div v-if="service.isScheduled" class="asc-actions">
                    <pv-button
                        id="btn-extend-wait"
                        label="Extender Espera (+15 min)"
                        icon="pi pi-clock"
                        severity="secondary"
                        outlined
                        size="small"
                        @click="emit('extend-wait', { executionId: service.executionId, minutes: 15 })"
                    />
                    <pv-button
                        id="btn-cancel-service"
                        label="Cancelar Servicio"
                        icon="pi pi-times"
                        severity="danger"
                        outlined
                        size="small"
                        @click="emit('cancel-service', service.executionId)"
                    />
                </div>
            </template>
            <div v-else class="asc-empty">
                <i class="pi pi-check-circle asc-empty-icon asc-empty-icon--ok" />
                <p>No tienes ningún servicio activo en este momento.</p>
            </div>
        </template>
    </div>
</template>

<style scoped>
.asc-card {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 280px;
}

.asc-skeleton { display: flex; flex-direction: column; gap: 0.5rem; }

.asc-header {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.asc-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}
.asc-icon--tech   { background: rgba(25, 120, 229, 0.12); color: #1978e5; }
.asc-icon--client { background: rgba(16, 185, 129, 0.12); color: #10b981; }

.asc-title    { font-size: 1rem; font-weight: 700; color: var(--el-primary); margin: 0; }
.asc-subtitle { font-size: 0.8rem; color: var(--el-gray); margin: 0; }

.asc-availability-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.asc-toggle :deep(.p-togglebutton) { min-width: 120px; }

.asc-current-service { display: flex; flex-direction: column; gap: 0.75rem; }

.asc-info-row {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}

.asc-row-icon { color: var(--el-custom); margin-top: 0.2rem; font-size: 0.9rem; }

.asc-detail-label { font-size: 0.65rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.asc-detail-value { font-size: 0.9rem; font-weight: 600; color: var(--el-primary); margin: 0; }

.asc-client-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.85rem;
}

.asc-data-item { display: flex; flex-direction: column; gap: 0.2rem; }
.asc-data-item--full { grid-column: 1 / -1; }

.asc-label { font-size: 0.65rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; }
.asc-value { font-size: 0.9rem; font-weight: 600; color: var(--el-primary); margin: 0; }

.asc-status-row { display: flex; }

.asc-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.asc-btn-start { background: var(--el-custom); border-color: var(--el-custom); }

.asc-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1.5rem 0;
    color: var(--el-warm-gray);
    text-align: center;
    font-size: 0.875rem;
}

.asc-empty-icon       { font-size: 2.5rem; color: var(--el-warm-gray); }
.asc-empty-icon--ok   { color: var(--el-success); }
</style>
