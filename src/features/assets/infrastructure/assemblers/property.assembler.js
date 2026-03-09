import { Property } from '../../domain/entities/property.entity.js';
import { PropertyPortfolio } from '../../domain/entities/property-portfolio.entity.js';
import { PortfolioEntry } from '../../domain/entities/portfolio-entry.entity.js';
import { PropertyResource } from '../resources/property.resource.js';
import { PropertyPortfolioResource } from '../resources/property-portfolio.resource.js';
import { PortfolioEntryResource } from '../resources/portfolio-entry.resource.js';
import { AddressResource } from '../resources/address.resource.js';
import { GeolocationResource } from '../resources/geolocation.resource.js';

export class PropertyAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;
        return new Property({
            id: resource.propertyId,
            ownerId: resource.homeownerId,
            address: resource.address,
            geolocation: resource.geolocation,
            status: resource.status,
            isActive: resource.isActive
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;
        return new PropertyResource({
            propertyId: entity.id,
            homeownerId: entity.ownerId,
            address: entity.address ? new AddressResource(entity.address) : null,
            geolocation: entity.geolocation ? new GeolocationResource(entity.geolocation) : null,
            status: entity.status,
            isActive: entity.isActive
        });
    }

    static toPortfolioEntityFromResource(resource) {
        if (!resource) return null;
        const entries = resource.entries ? resource.entries.map(e => new PortfolioEntry({
            propertyId: e.propertyId,
            nickname: e.nickname,
            isPrimary: e.isPrimary,
            occupancyStatus: e.occupancyStatus
        })) : [];

        return new PropertyPortfolio({
            id: resource.id,
            homeownerId: resource.homeownerId,
            status: resource.status,
            entries: entries
        });
    }

    static toPortfolioResourceFromEntity(entity) {
        if (!entity) return null;
        const entries = entity.entries ? entity.entries.map(e => new PortfolioEntryResource({
            propertyId: e.propertyId,
            nickname: e.nickname,
            isPrimary: e.isPrimary,
            occupancyStatus: e.occupancyStatus
        })) : [];

        return new PropertyPortfolioResource({
            id: entity.id,
            homeownerId: entity.homeownerId,
            status: entity.status,
            entries: entries
        });
    }

    static toCreateCommandFromResource(resource, homeownerId) {
        if (!resource) return null;
        return {
            homeownerId: homeownerId,
            address: resource.address,
            geolocation: {
                ...resource.geolocation,
                source: "MANUAL"
            }
        };
    }

    static toAddPropertyToPortfolioCommand(resource, homeownerId) {
        if (!resource) return null;
        return {
            homeownerId: homeownerId,
            propertyId: resource.propertyId,
            nickname: resource.nickname,
            isPrimary: resource.isPrimary,
            occupancyStatus: resource.occupancyStatus
        };
    }
}
