/**
 * ServiceOrder — Domain Entity
 * Represents a service execution order in the monitoring bounded context.
 */
export class ServiceOrder {
    constructor({
        executionId = '',
        serviceRequestId = '',
        technicianId = '',
        technicianName = '',
        clientId = '',
        clientName = '',
        propertyId = '',
        propertyAddress = '',
        status = 'Scheduled',           // Scheduled | InProgress | Completed | Cancelled
        currentStep = 0,                // 0-4 steps for the p-stepper
        scheduledDate = null,
        scheduledTime = '',
        startedAt = null,
        completedAt = null,
        cancelledAt = null,
        cancelReason = '',
        estimatedDurationMinutes = 60,
        serviceType = '',
        specialties = [],
        reportContent = '',
        findings = '',
        recommendations = '',
        iotFindings = '',
        photosCount = 0,
        componentsUsed = [],
        totalCost = 0,
        currency = 'USD',
        technicianRating = null,
        clientRating = null,
        waitExtensionMinutes = 0,
    } = {}) {
        this.executionId = executionId;
        this.serviceRequestId = serviceRequestId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.clientId = clientId;
        this.clientName = clientName;
        this.propertyId = propertyId;
        this.propertyAddress = propertyAddress;
        this.status = status;
        this.currentStep = currentStep;
        this.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
        this.scheduledTime = scheduledTime;
        this.startedAt = startedAt ? new Date(startedAt) : null;
        this.completedAt = completedAt ? new Date(completedAt) : null;
        this.cancelledAt = cancelledAt ? new Date(cancelledAt) : null;
        this.cancelReason = cancelReason;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.serviceType = serviceType;
        this.specialties = specialties;
        this.reportContent = reportContent;
        this.findings = findings;
        this.recommendations = recommendations;
        this.iotFindings = iotFindings;
        this.photosCount = photosCount;
        this.componentsUsed = componentsUsed;
        this.totalCost = totalCost;
        this.currency = currency;
        this.technicianRating = technicianRating;
        this.clientRating = clientRating;
        this.waitExtensionMinutes = waitExtensionMinutes;
    }

    get isScheduled()   { return this.status === 'Scheduled'; }
    get isInProgress()  { return this.status === 'InProgress'; }
    get isCompleted()   { return this.status === 'Completed'; }
    get isCancelled()   { return this.status === 'Cancelled'; }

    get statusSeverity() {
        const map = {
            Scheduled:  'info',
            InProgress: 'warn',
            Completed:  'success',
            Cancelled:  'danger',
        };
        return map[this.status] ?? 'secondary';
    }

    get formattedCost() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currency,
        }).format(this.totalCost);
    }

    get canStart()    { return this.isScheduled; }
    get canComplete() { return this.isInProgress && this.photosCount > 0 && this.reportContent.length > 0; }
    get canCancel()   { return this.isScheduled || this.isInProgress; }
}
