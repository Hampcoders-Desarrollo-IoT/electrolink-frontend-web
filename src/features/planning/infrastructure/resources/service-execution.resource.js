export class ServiceExecutionResource {
    constructor({ executionId, requestId, technicianId, homeownerId, propertyId, status, scheduledDate, startedAt, completedAt, report, photos, componentsUsed, hasIoTDevice, iotRelayState, createdAt }) {
        this.executionId = executionId;
        this.requestId = requestId;
        this.technicianId = technicianId;
        this.homeownerId = homeownerId;
        this.propertyId = propertyId;
        this.status = status;
        this.scheduledDate = scheduledDate;
        this.startedAt = startedAt;
        this.completedAt = completedAt;
        this.report = report;
        this.photos = photos || [];
        this.componentsUsed = componentsUsed || [];
        this.hasIoTDevice = hasIoTDevice;
        this.iotRelayState = iotRelayState;
        this.createdAt = createdAt;
    }
}
