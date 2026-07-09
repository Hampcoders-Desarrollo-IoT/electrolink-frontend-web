import { ServiceExecution } from '../../domain/entities/service-execution.entity.js';
import { ServiceExecutionResource } from '../resources/service-execution.resource.js';

export class ServiceExecutionAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceExecution({
            executionId: resource.executionId,
            requestId: resource.requestId,
            technicianId: resource.technicianId,
            homeownerId: resource.homeownerId,
            propertyId: resource.propertyId,
            status: resource.status,
            scheduledDate: resource.scheduledDate,
            startedAt: resource.startedAt,
            completedAt: resource.completedAt,
            report: resource.report,
            photos: resource.photos || [],
            componentsUsed: resource.componentsUsed || [],
            hasIoTDevice: resource.hasIoTDevice,
            iotRelayState: resource.iotRelayState,
            createdAt: resource.createdAt
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new ServiceExecutionResource({
            executionId: entity.executionId,
            requestId: entity.requestId,
            technicianId: entity.technicianId,
            homeownerId: entity.homeownerId,
            propertyId: entity.propertyId,
            status: entity.status,
            scheduledDate: entity.scheduledDate,
            startedAt: entity.startedAt,
            completedAt: entity.completedAt,
            report: entity.report,
            photos: entity.photos,
            componentsUsed: entity.componentsUsed,
            hasIoTDevice: entity.hasIoTDevice,
            iotRelayState: entity.iotRelayState,
            createdAt: entity.createdAt
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return [];
        const data = Array.isArray(response.data) ? response.data : [response.data];
        return data.map(r => this.toEntityFromResource(r));
    }
}
