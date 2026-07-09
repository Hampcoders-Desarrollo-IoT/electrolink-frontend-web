import { ServiceRequest } from '../../domain/entities/service-request.entity.js';
import { ServiceRequestResource } from '../resources/service-request.resource.js';

export class ServiceRequestAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceRequest({
            requestId: resource.requestId,
            clientId: resource.clientId,
            clientType: resource.clientType,
            status: resource.status,
            requestType: resource.requestType,
            propertyId: resource.propertyId,
            requestedCategory: resource.requestedCategory,
            isPriority: resource.isPriority,
            hasIoTDevice: resource.hasIoTDevice,
            assignedTechnicianId: resource.assignedTechnicianId,
            createdAt: resource.createdAt
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceRequestResource({
            requestId: entity.requestId,
            clientId: entity.clientId,
            clientType: entity.clientType,
            status: entity.status,
            requestType: entity.requestType,
            propertyId: entity.propertyId,
            requestedCategory: entity.requestedCategory,
            isPriority: entity.isPriority,
            hasIoTDevice: entity.hasIoTDevice,
            assignedTechnicianId: entity.assignedTechnicianId,
            createdAt: entity.createdAt
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
