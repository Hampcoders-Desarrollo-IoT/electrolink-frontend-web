<script setup>
import { ref, computed } from 'vue';
import { useSubscriptionStore } from '../../application/subscription.store.js';

const store = useSubscriptionStore();

const globalFilter = ref('');

const columns = [
    { field: 'formattedDate',   header: 'Date',        sortable: true  },
    { field: 'description',     header: 'Description', sortable: false },
    { field: 'formattedAmount', header: 'Amount',      sortable: true  },
    { field: 'status',          header: 'Status',      sortable: true  },
    { field: 'invoice',         header: 'Invoice',     sortable: false },
];

const statusSeverityMap = {
    PAID:     'success',
    FAILED:   'danger',
    REFUNDED: 'warn',
    PENDING:  'info',
};

function getSeverity(status) {
    return statusSeverityMap[status] ?? 'secondary';
}

function openInvoice(record) {
    if (record.invoiceUrl) {
        window.open(record.invoiceUrl, '_blank', 'noopener,noreferrer');
    }
}

async function downloadAll() {
    // Opens Stripe portal for bulk invoice access
    await store.openStripePortal();
}

function onPage(event) {
    const newPage = event.page + 1; // PrimeVue is 0-indexed
    store.fetchPaymentHistory(newPage, store.historyPageSize);
}
</script>

<template>
    <section class="billing-history-section">
        <div class="billing-history-header">
            <h2 class="billing-history-title">Billing History</h2>
            <pv-button
                label="Download All"
                icon="pi pi-download"
                :loading="store.isPortalLoading"
                class="download-all-btn"
                text
                @click="downloadAll"
            />
        </div>

        <!-- Skeleton loader -->
        <div v-if="store.isLoading && !store.paymentHistory.length" class="history-skeleton">
            <div v-for="i in 3" :key="i" class="skeleton-row"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!store.isLoading && !store.paymentHistory.length" class="history-empty">
            <i class="pi pi-receipt history-empty-icon"></i>
            <p>No billing records yet.</p>
        </div>

        <!-- Data Table -->
        <div v-else class="history-table-wrapper">
            <pv-data-table
                :value="store.paymentHistory"
                :lazy="true"
                :totalRecords="store.historyTotal"
                :rows="store.historyPageSize"
                paginator
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                :rowsPerPageOptions="[10, 20, 50]"
                @page="onPage"
                stripedRows
                class="history-table"
                :pt="{
                    table: { style: 'min-width: 580px' },
                    headerRow: { class: 'history-table-header' },
                }"
            >
                <pv-column field="formattedDate" header="Date" sortable style="width: 160px">
                    <template #body="{ data }">
                        <span class="cell-date">{{ data.formattedDate }}</span>
                    </template>
                </pv-column>

                <pv-column field="description" header="Description">
                    <template #body="{ data }">
                        <span class="cell-description">{{ data.description }}</span>
                    </template>
                </pv-column>

                <pv-column field="formattedAmount" header="Amount" style="width: 130px">
                    <template #body="{ data }">
                        <span class="cell-amount">{{ data.formattedAmount }}</span>
                    </template>
                </pv-column>

                <pv-column field="status" header="Status" style="width: 110px">
                    <template #body="{ data }">
                        <pv-tag
                            :value="data.status"
                            :severity="getSeverity(data.status)"
                            class="status-tag"
                        />
                    </template>
                </pv-column>

                <pv-column header="Invoice" style="width: 80px; text-align: center">
                    <template #body="{ data }">
                        <pv-button
                            icon="pi pi-file-pdf"
                            text
                            rounded
                            :disabled="!data.invoiceUrl"
                            class="invoice-btn"
                            v-tooltip.top="data.invoiceUrl ? 'Download Invoice' : 'Not available'"
                            @click="openInvoice(data)"
                        />
                    </template>
                </pv-column>
            </pv-data-table>
        </div>
    </section>
</template>

<style scoped>
.billing-history-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.billing-history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.billing-history-title {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--el-primary);
    margin: 0;
}

.download-all-btn {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--el-custom);
}

/* Skeleton */
.history-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
}

.skeleton-row {
    height: 48px;
    background: linear-gradient(90deg, rgba(169,177,186,0.15) 25%, rgba(169,177,186,0.3) 50%, rgba(169,177,186,0.15) 75%);
    background-size: 200% 100%;
    border-radius: 8px;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

/* Empty State */
.history-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 3rem 1rem;
    color: var(--el-warm-gray);
    text-align: center;
}

.history-empty-icon {
    font-size: 2.5rem;
    opacity: 0.4;
}

/* Table Wrapper */
.history-table-wrapper {
    background: white;
    border-radius: 12px;
    border: 1px solid rgba(169, 177, 186, 0.2);
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(46, 58, 89, 0.05);
}

.history-table {
    width: 100%;
}

/* Override PrimeVue table header */
:deep(.history-table .p-datatable-thead > tr > th) {
    background: var(--el-bg-soft) !important;
    color: var(--el-gray);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(169, 177, 186, 0.2);
}

:deep(.history-table .p-datatable-tbody > tr > td) {
    padding: 0.875rem 1rem;
    border-bottom: 1px solid rgba(169, 177, 186, 0.08);
    font-size: 0.875rem;
    color: var(--el-primary);
    vertical-align: middle;
}

:deep(.history-table .p-datatable-tbody > tr:hover) {
    background: rgba(232, 238, 246, 0.4) !important;
}

:deep(.history-table .p-datatable-tbody > tr:last-child > td) {
    border-bottom: none;
}

.cell-date {
    font-size: 0.875rem;
    color: var(--el-gray);
    white-space: nowrap;
}

.cell-description {
    font-size: 0.875rem;
    color: var(--el-primary);
}

.cell-amount {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--el-primary);
    white-space: nowrap;
}

.status-tag {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
}

.invoice-btn {
    color: var(--el-gray) !important;
}

.invoice-btn:hover:not(:disabled) {
    color: var(--el-custom) !important;
}

/* Paginator override */
:deep(.p-paginator) {
    background: transparent;
    border-top: 1px solid rgba(169, 177, 186, 0.15);
    padding: 0.75rem 1rem;
}
</style>
