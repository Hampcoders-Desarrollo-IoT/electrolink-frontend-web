export class ServiceOrder {
    constructor({
        executionId = '',
        assignmentId = '',
        serviceRequestId = '',
        technicianId = '',
        technicianName = '',
        clientId = '',
        clientName = '',
        propertyId = '',
        propertyAddress = '',
        status = 'Notified',
        scheduledDate = null,
        scheduledTime = '',
        startedAt = null,
        completedAt = null,
        cancelledAt = null,
        cancelReason = '',
        estimatedDurationMinutes = 60,
        serviceType = '',
        serviceName = '',
        serviceCategory = '',
        specialties = [],
        reportContent = '',
        findings = '',
        recommendations = '',
        iotFindings = '',
        photosCount = 0,
        componentsUsed = [],
        totalCost = 0,
        totalPrice = 0,
        currency = 'USD',
        isPriority = false,
        hasIoTContext = false,
        deviceId = null,
        requiresIoTCertifiedTechnician = false,
        technicianRating = null,
        clientRating = null,
        waitExtensionMinutes = 0,
        workLog = null,
        latitude = null,
        longitude = null,
    } = {}) {
        this.executionId = executionId;
        this.assignmentId = assignmentId;
        this.serviceRequestId = serviceRequestId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.clientId = clientId;
        this.clientName = clientName;
        this.propertyId = propertyId;
        this.propertyAddress = propertyAddress;
        this.status = status;
        this.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
        this.scheduledTime = scheduledTime;
        this.startedAt = startedAt ? new Date(startedAt) : null;
        this.completedAt = completedAt ? new Date(completedAt) : null;
        this.cancelledAt = cancelledAt ? new Date(cancelledAt) : null;
        this.cancelReason = cancelReason;
        this.estimatedDurationMinutes = estimatedDurationMinutes;
        this.serviceType = serviceType;
        this.serviceName = serviceName;
        this.serviceCategory = serviceCategory;
        this.specialties = specialties;
        this.reportContent = reportContent;
        this.findings = findings;
        this.recommendations = recommendations;
        this.iotFindings = iotFindings;
        this.photosCount = photosCount;
        this.componentsUsed = componentsUsed;
        this.totalCost = totalCost || totalPrice;
        this.totalPrice = totalPrice || totalCost;
        this.currency = currency;
        this.isPriority = isPriority;
        this.hasIoTContext = hasIoTContext;
        this.deviceId = deviceId;
        this.requiresIoTCertifiedTechnician = requiresIoTCertifiedTechnician;
        this.technicianRating = technicianRating;
        this.clientRating = clientRating;
        this.waitExtensionMinutes = waitExtensionMinutes;
        this.workLog = workLog;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    get currentStep() {
        const stepMap = {
            'Notified': 0,
            'EnRoute': 1,
            'Arrived': 2,
            'InProgress': 2,
            'PendingReview': 3,
            'Completed': 4,
            'Cancelled': -1,
        };
        return stepMap[this.status] ?? 0;
    }

    get isScheduled()   { return this.status === 'Notified'; }
    get isEnRoute()     { return this.status === 'EnRoute'; }
    get isArrived()     { return this.status === 'Arrived'; }
    get isInProgress()  { return this.status === 'InProgress'; }
    get isPendingReview() { return this.status === 'PendingReview'; }
    get isCompleted()   { return this.status === 'Completed'; }
    get isCancelled()   { return this.status === 'Cancelled'; }

    get statusSeverity() {
        const map = {
            Notified:       'info',
            EnRoute:        'warn',
            Arrived:        'warn',
            InProgress:     'warn',
            PendingReview:  'info',
            Completed:      'success',
            Cancelled:      'danger',
        };
        return map[this.status] ?? 'secondary';
    }

    get formattedCost() {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.currency,
        }).format(this.totalCost);
    }

    get canStart()    { return this.status === 'Notified'; }
    get canComplete() { return (this.status === 'Arrived' || this.status === 'InProgress') && this.photosCount > 0 && this.reportContent.length > 0; }
    get canCancel()   { return !this.isCompleted && !this.isCancelled && !this.isPendingReview; }
}
