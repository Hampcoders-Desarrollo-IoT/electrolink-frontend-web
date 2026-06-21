import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

const homeownersEndpointPath = import.meta.env.VITE_HOMEOWNERS_ENDPOINT_PATH;
const techniciansEndpointPath = import.meta.env.VITE_TECHNICIANS_ENDPOINT_PATH;

export class PropertiesApiService extends BaseApi {
    constructor() {
        super();
    }

    // ── Homeowner paths ────────────────────────────────────────────────────

    #homeownerPropertiesPath(ownerId) {
        return `${homeownersEndpointPath}/${ownerId}/properties`;
    }

    // ── Company paths ──────────────────────────────────────────────────────

    #companyPropertiesPath(ownerId) {
        return `/companies/${ownerId}/properties`;
    }

    // ── Homeowner endpoints ────────────────────────────────────────────────

    getAll(ownerId, params = {}) {
        return this.http.get(this.#homeownerPropertiesPath(ownerId), { params });
    }

    getById(ownerId, id) {
        return this.http.get(`${this.#homeownerPropertiesPath(ownerId)}/${id}`);
    }

    create(ownerId, command) {
        return this.http.post(this.#homeownerPropertiesPath(ownerId), command);
    }

    updateAddress(ownerId, propertyId, resource) {
        return this.http.patch(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/address`, resource);
    }

    updateGeolocation(ownerId, propertyId, resource) {
        return this.http.patch(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/geolocation`, resource);
    }

    activate(ownerId, propertyId) {
        return this.http.patch(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/activate`);
    }

    deactivate(ownerId, propertyId) {
        return this.http.patch(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/deactivate`);
    }

    delete(ownerId, propertyId, reason = '') {
        const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return this.http.delete(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}${params}`);
    }

    // ── Company endpoints ──────────────────────────────────────────────────

    getAllCompany(ownerId, params = {}) {
        return this.http.get(this.#companyPropertiesPath(ownerId), { params });
    }

    getCompanyById(ownerId, id) {
        return this.http.get(`${this.#companyPropertiesPath(ownerId)}/${id}`);
    }

    createCompany(ownerId, command) {
        return this.http.post(this.#companyPropertiesPath(ownerId), command);
    }

    updateLocation(ownerId, propertyId, resource) {
        return this.http.patch(`${this.#companyPropertiesPath(ownerId)}/${propertyId}/location`, resource);
    }

    activateCompany(ownerId, propertyId) {
        return this.http.patch(`${this.#companyPropertiesPath(ownerId)}/${propertyId}/activate`);
    }

    // ── Photo endpoints (shared, under /homeowners path) ───────────────────

    getUploadUrl(ownerId, propertyId) {
        return this.http.get(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/photos/upload-url`);
    }

    registerPhoto(ownerId, propertyId, resource) {
        return this.http.post(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/photos`, resource);
    }

    setMainPhoto(ownerId, propertyId, resource) {
        return this.http.post(`${this.#homeownerPropertiesPath(ownerId)}/${propertyId}/main-photo`, resource);
    }
}
