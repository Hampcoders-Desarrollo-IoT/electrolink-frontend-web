import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

const homeownersEndpointPath = import.meta.env.VITE_HOMEOWNERS_ENDPOINT_PATH;
const portfolioEndpointPath = import.meta.env.VITE_PROPERTY_PORTFOLIO_ENDPOINT_PATH;

export class PropertyPortfolioApiService extends BaseApi {
    constructor() {
        super();
    }

    #portfolioPath(ownerId) {
        return `${homeownersEndpointPath}/${ownerId}${portfolioEndpointPath}`;
    }

    #portfolioPropertiesPath(ownerId) {
        return `${this.#portfolioPath(ownerId)}/properties`;
    }

    getAll(ownerId) {
        return this.http.get(this.#portfolioPath(ownerId));
    }

    addProperty(ownerId, command) {
        return this.http.post(this.#portfolioPropertiesPath(ownerId), command);
    }

    removeProperty(ownerId, propertyId, reason = '') {
        const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return this.http.delete(`${this.#portfolioPropertiesPath(ownerId)}/${propertyId}${params}`);
    }
}
