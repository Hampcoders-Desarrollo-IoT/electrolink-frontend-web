import { ServiceOrder }      from '../../domain/models/service-order.entity.js';
import { TelemetryLog }      from '../../domain/models/telemetry-log.entity.js';
import { ServiceOrderResource } from '../resources/service-order.resource.js';
import { TelemetryResource, RelayStatusResource } from '../resources/telemetry.resource.js';

/**
 * MonitoringAssembler — Transforma datos crudos de la API
 * (snake_case / PascalCase / camelCase) a las entidades de dominio camelCase.
 */
export class MonitoringAssembler {

    // ─── Service Order ────────────────────────────────────────────────────────

    /**
     * Transforma la respuesta HTTP de la API a un ServiceOrderResource.
     * @param {import('axios').AxiosResponse} response
     * @returns {ServiceOrderResource|null}
     */
    static toServiceOrderResourceFromResponse(response) {
        if (!response || (response.status !== 200 && response.status !== 201)) {
            console.error(`[MonitoringAssembler] Unexpected status: ${response?.status}`);
            return null;
        }
        const data = response.data;
        return new ServiceOrderResource(MonitoringAssembler.#normalizeKeys(data));
    }

    /**
     * Transforma un ServiceOrderResource a la entidad de dominio ServiceOrder.
     * @param {ServiceOrderResource} resource
     * @returns {ServiceOrder}
     */
    static toServiceOrderEntityFromResource(resource) {
        if (!resource) return null;
        return new ServiceOrder({ ...resource });
    }

    /**
     * Transforma una lista de respuestas a un array de ServiceOrder.
     * @param {import('axios').AxiosResponse} response
     * @returns {ServiceOrder[]}
     */
    static toServiceOrderListFromResponse(response) {
        if (!response || (response.status !== 200 && response.status !== 201)) return [];
        const items = Array.isArray(response.data) ? response.data : (response.data?.items ?? []);
        return items.map(raw => {
            const resource = new ServiceOrderResource(MonitoringAssembler.#normalizeKeys(raw));
            return MonitoringAssembler.toServiceOrderEntityFromResource(resource);
        });
    }

    // ─── Telemetry ────────────────────────────────────────────────────────────

    /**
     * @param {import('axios').AxiosResponse} response
     * @returns {TelemetryLog|null}
     */
    static toTelemetryEntityFromResponse(response) {
        if (!response || (response.status !== 200 && response.status !== 201)) return null;
        const resource = new TelemetryResource(MonitoringAssembler.#normalizeKeys(response.data));
        return new TelemetryLog({ ...resource });
    }

    /**
     * @param {import('axios').AxiosResponse} response
     * @returns {RelayStatusResource[]}
     */
    static toRelayStatusListFromResponse(response) {
        if (!response || (response.status !== 200 && response.status !== 201)) return [];
        const items = Array.isArray(response.data) ? response.data : (response.data?.items ?? []);
        return items.map(raw => new RelayStatusResource(MonitoringAssembler.#normalizeKeys(raw)));
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Normaliza claves snake_case → camelCase de forma recursiva.
     * Soporta objetos planos y arrays.
     * @param {*} data
     * @returns {*}
     */
    static #normalizeKeys(data) {
        if (Array.isArray(data)) {
            return data.map(item => MonitoringAssembler.#normalizeKeys(item));
        }
        if (data !== null && typeof data === 'object') {
            return Object.fromEntries(
                Object.entries(data).map(([key, value]) => [
                    MonitoringAssembler.#toCamelCase(key),
                    MonitoringAssembler.#normalizeKeys(value),
                ])
            );
        }
        return data;
    }

    static #toCamelCase(str) {
        return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    }
}
