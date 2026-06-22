export class ServiceRequestResource {
    constructor({ requestId, clientId, clientType, status, requestType, propertyId, requestedCategory, isPriority, hasIoTDevice, assignedTechnicianId, createdAt }) {
        this.requestId = requestId;
        this.clientId = clientId;
        this.clientType = clientType;
        this.status = status;
        this.requestType = requestType;
        this.propertyId = propertyId;
        this.requestedCategory = requestedCategory;
        this.isPriority = isPriority;
        this.hasIoTDevice = hasIoTDevice;
        this.assignedTechnicianId = assignedTechnicianId;
        this.createdAt = createdAt;
    }
}
