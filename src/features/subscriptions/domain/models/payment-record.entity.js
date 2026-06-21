/**
 * PaymentRecord Entity
 * Represents a single entry in the user's billing history.
 */
export class PaymentRecordEntity {
    /**
     * @param {Object} data
     * @param {string} data.id
     * @param {string} data.subscriptionId
     * @param {string} data.description       - Human-readable charge description
     * @param {number} data.amount            - Amount in local currency (e.g., PEN)
     * @param {string} data.currency          - ISO 4217 code, e.g. 'PEN'
     * @param {string} data.status            - 'PAID' | 'FAILED' | 'REFUNDED' | 'PENDING'
     * @param {string} data.paidAt            - ISO date string of payment date
     * @param {string|null} data.invoiceUrl   - Stripe-hosted invoice PDF URL
     * @param {string|null} data.stripePaymentIntentId
     */
    constructor(data = {}) {
        this.id                     = data.id ?? null;
        this.subscriptionId         = data.subscriptionId ?? null;
        this.description            = data.description ?? '';
        this.amount                 = data.amount ?? 0;
        this.currency               = data.currency ?? 'PEN';
        this.status                 = data.status ?? 'PAID';
        this.paidAt                 = data.paidAt ?? null;
        this.invoiceUrl             = data.invoiceUrl ?? null;
        this.stripePaymentIntentId  = data.stripePaymentIntentId ?? null;
    }

    /** Formatted amount string e.g. "S/ 29.90" */
    get formattedAmount() {
        const symbol = this.currency === 'PEN' ? 'S/' : this.currency;
        return `${symbol} ${Number(this.amount).toFixed(2)}`;
    }

    /** Formatted date string e.g. "Oct 01, 2023" */
    get formattedDate() {
        if (!this.paidAt) return '—';
        return new Date(this.paidAt).toLocaleDateString('en-US', {
            month: 'short',
            day:   '2-digit',
            year:  'numeric',
        });
    }

    /** Severity for PrimeVue Tag */
    get statusSeverity() {
        const map = {
            PAID:     'success',
            FAILED:   'danger',
            REFUNDED: 'warn',
            PENDING:  'info',
        };
        return map[this.status] ?? 'secondary';
    }
}
