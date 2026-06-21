<script setup>
/**
 * ServiceHistoryTable — Historial inferior de servicios.
 * Clona exactamente los estilos de "Billing History":
 *   - pv-data-table con la paleta corporativa
 *   - Estados del servicio con badges de color
 *   - Costo del servicio donde iba el importe de facturación
 */
import { computed, ref } from 'vue';

const props = defineProps({
    /** @type {import('../../domain/models/service-order.entity.js').ServiceOrder[]} */
    history:      { type: Array,   default: () => [] },
    isLoading:    { type: Boolean, default: false },
    businessRole: { type: String,  required: true },
});

const globalFilter = ref('');

const statusConfig = {
    Completed:  { severity: 'success', label: 'Completado' },
    Cancelled:  { severity: 'danger',  label: 'Cancelado'  },
    InProgress: { severity: 'info',    label: 'En Progreso' },
    Scheduled:  { severity: 'warn',    label: 'Programado'  },
};

function getStatusConfig(status) {
    return statusConfig[status] ?? { severity: 'secondary', label: status };
}

function formatDate(date) {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(date));
}

function formatCost(amount, currency = 'USD') {
    if (!amount && amount !== 0) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

const isTechnician = computed(() => props.businessRole === 'Technician');
</script>

<template>
    <div class="sht-wrapper el-card el-shadow">
        <!-- Header -->
        <div class="sht-header">
            <div class="sht-title-group">
                <div class="sht-title-icon">
                    <i class="pi pi-list-check" />
                </div>
                <div>
                    <h3 class="sht-title">Historial de Servicios</h3>
                    <p class="sht-subtitle">Registro de órdenes finalizadas y canceladas</p>
                </div>
            </div>
            <pv-icon-field>
                <pv-input-icon class="pi pi-search" />
                <pv-input-text
                    v-model="globalFilter"
                    placeholder="Buscar..."
                    size="small"
                    class="sht-search"
                />
            </pv-icon-field>
        </div>

        <!-- Table -->
        <pv-data-table
            :value="history"
            :loading="isLoading"
            :global-filter-fields="['technicianName', 'clientName', 'serviceType', 'status', 'propertyAddress']"
            :global-filter="globalFilter"
            :rows="10"
            :paginator="history.length > 10"
            paginator-template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            removable-sort
            striped-rows
            class="sht-table"
            empty-message="No hay servicios en el historial."
            size="small"
        >
            <!-- Date Column -->
            <pv-column
                field="scheduledDate"
                header="Fecha"
                sortable
                style="min-width: 120px"
            >
                <template #body="{ data }">
                    <span class="sht-date">{{ formatDate(data.scheduledDate) }}</span>
                </template>
            </pv-column>

            <!-- Service ID -->
            <pv-column
                field="executionId"
                header="ID Orden"
                style="min-width: 130px"
            >
                <template #body="{ data }">
                    <code class="sht-code">{{ data.executionId?.slice(0, 8) }}…</code>
                </template>
            </pv-column>

            <!-- Role-specific counterpart name -->
            <pv-column
                :field="isTechnician ? 'clientName' : 'technicianName'"
                :header="isTechnician ? 'Cliente' : 'Técnico'"
                sortable
                style="min-width: 150px"
            >
                <template #body="{ data }">
                    <div class="sht-person">
                        <pv-avatar icon="pi pi-user" size="small" shape="circle" class="sht-avatar" />
                        <span>{{ isTechnician ? data.clientName : data.technicianName }}</span>
                    </div>
                </template>
            </pv-column>

            <!-- Service Type -->
            <pv-column
                field="serviceType"
                header="Tipo de Servicio"
                sortable
                style="min-width: 150px"
            >
                <template #body="{ data }">
                    <span class="sht-type">{{ data.serviceType || '-' }}</span>
                </template>
            </pv-column>

            <!-- Address -->
            <pv-column
                field="propertyAddress"
                header="Propiedad"
                style="min-width: 180px"
            >
                <template #body="{ data }">
                    <span class="sht-address">{{ data.propertyAddress || '-' }}</span>
                </template>
            </pv-column>

            <!-- Cost (replaces billing amount) -->
            <pv-column
                field="totalCost"
                header="Costo Total"
                sortable
                style="min-width: 110px; text-align: right"
            >
                <template #body="{ data }">
                    <span class="sht-cost">{{ formatCost(data.totalCost, data.currency) }}</span>
                </template>
            </pv-column>

            <!-- Status (replaces payment status) -->
            <pv-column
                field="status"
                header="Estado"
                sortable
                style="min-width: 130px"
            >
                <template #body="{ data }">
                    <pv-tag
                        :value="getStatusConfig(data.status).label"
                        :severity="getStatusConfig(data.status).severity"
                        class="sht-badge"
                    />
                </template>
            </pv-column>

            <!-- Duration -->
            <pv-column
                field="estimatedDurationMinutes"
                header="Duración Est."
                style="min-width: 110px"
            >
                <template #body="{ data }">
                    <span class="sht-duration">{{ data.estimatedDurationMinutes ? `${data.estimatedDurationMinutes} min` : '-' }}</span>
                </template>
            </pv-column>

            <!-- Empty state -->
            <template #empty>
                <div class="sht-empty">
                    <i class="pi pi-inbox sht-empty-icon" />
                    <p>No hay servicios en el historial.</p>
                </div>
            </template>

            <!-- Loading state -->
            <template #loadingicon>
                <i class="pi pi-spin pi-spinner" style="font-size: 2rem; color: var(--el-custom)" />
            </template>
        </pv-data-table>
    </div>
</template>

<style scoped>
.sht-wrapper {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    overflow: hidden;
}

.sht-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
}

.sht-title-group { display: flex; align-items: flex-start; gap: 0.75rem; }

.sht-title-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 10px;
    background: rgba(46, 58, 89, 0.08);
    color: var(--el-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.sht-title    { font-size: 1rem; font-weight: 700; color: var(--el-primary); margin: 0; }
.sht-subtitle { font-size: 0.8rem; color: var(--el-gray); margin: 0; }

.sht-search { font-size: 0.825rem; }

/* Table overrides */
.sht-table :deep(.p-datatable-table) { border-collapse: separate; border-spacing: 0; }

.sht-table :deep(.p-datatable-thead > tr > th) {
    background: var(--el-bg-soft);
    color: var(--el-primary);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1rem;
    border-bottom: 2px solid rgba(169, 177, 186, 0.2);
}

.sht-table :deep(.p-datatable-tbody > tr) {
    transition: background 0.15s ease;
}
.sht-table :deep(.p-datatable-tbody > tr:hover) {
    background: rgba(25, 120, 229, 0.04) !important;
}
.sht-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.7rem 1rem;
    border-bottom: 1px solid rgba(169, 177, 186, 0.1);
    vertical-align: middle;
}

/* Cell styles */
.sht-date     { font-size: 0.825rem; font-weight: 500; color: var(--el-primary); }
.sht-code     { font-family: monospace; font-size: 0.75rem; background: var(--el-bg-soft); padding: 0.15rem 0.4rem; border-radius: 4px; color: var(--el-gray); }
.sht-type     { font-size: 0.825rem; color: var(--el-gray); }
.sht-address  { font-size: 0.8rem; color: var(--el-gray); }
.sht-duration { font-size: 0.825rem; color: var(--el-gray); }
.sht-cost     { font-size: 0.9rem; font-weight: 700; color: var(--el-primary); }

.sht-person {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.825rem;
    font-weight: 500;
    color: var(--el-primary);
}

.sht-avatar :deep(.p-avatar) {
    background: rgba(25, 120, 229, 0.12);
    color: #1978e5;
    font-size: 0.6rem;
}

.sht-badge { font-size: 0.7rem; }

.sht-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem;
    color: var(--el-warm-gray);
    font-size: 0.875rem;
}
.sht-empty-icon { font-size: 2rem; }
</style>
