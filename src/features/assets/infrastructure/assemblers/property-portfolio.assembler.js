import { PropertyPortfolio } from '../../domain/entities/property-portfolio.entity.js';
import { PortfolioEntry } from '../../domain/entities/portfolio-entry.entity.js';
import { PropertyPortfolioResource } from '../resources/property-portfolio.resource.js';
import { PortfolioEntryResource } from '../resources/portfolio-entry.resource.js';

export class PropertyPortfolioAssembler {
    static toEntityFromResource(resource) {
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

    static toResourceFromEntity(entity) {
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
}
