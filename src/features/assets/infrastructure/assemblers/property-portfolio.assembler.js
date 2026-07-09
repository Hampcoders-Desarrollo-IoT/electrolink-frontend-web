import { PropertyPortfolio } from '../../domain/entities/property-portfolio.entity.js';
import { PortfolioEntry } from '../../domain/entities/portfolio-entry.entity.js';
import { PropertyPortfolioResource } from '../resources/property-portfolio.resource.js';

export class PropertyPortfolioAssembler {
    static toEntityFromResource(resource) {
        if (!resource) return null;

        const propertiesArray = resource.entries
            ? resource.entries.map(p => new PortfolioEntry({
                propertyId: p.propertyId,
                nickname: p.nickname,
                isPrimary: p.isPrimary,
                occupancyStatus: p.occupancyStatus
            }))
            : [];

        return new PropertyPortfolio({
            portfolioId: resource.id,
            ownerId: resource.ownerId,
            status: resource.status,
            properties: propertiesArray
        });
    }

    static toResourceFromEntity(entity) {
        if (!entity) return null;

        const propertiesArray = entity.properties
            ? entity.properties.map(p => ({
                propertyId: p.propertyId,
                nickname: p.nickname,
                isPrimary: p.isPrimary,
                occupancyStatus: p.occupancyStatus
            }))
            : [];

        return new PropertyPortfolioResource({
            portfolioId: entity.portfolioId,
            ownerId: entity.ownerId,
            status: entity.status,
            properties: propertiesArray
        });
    }

    static toEntityListFromResponse(response) {
        if (!response || !response.data) return null;
        return this.toEntityFromResource(response.data);
    }
}
