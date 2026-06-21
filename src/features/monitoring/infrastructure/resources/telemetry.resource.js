/**
 * TelemetryResource — Espejo de la estructura de transferencia de datos de la API
 * para el contexto IoT y el snapshot de telemetría de una ejecución.
 */
export class TelemetryResource {
    constructor(data = {}) {
        this.logId                  = data.logId                  ?? data.id    ?? '';
        this.executionId            = data.executionId            ?? '';
        this.capturedAt             = data.capturedAt             ?? null;
        this.voltageV               = data.voltageV               ?? null;
        this.currentA               = data.currentA               ?? null;
        this.powerW                 = data.powerW                 ?? null;
        this.frequencyHz            = data.frequencyHz            ?? null;
        this.powerFactorPf          = data.powerFactorPf          ?? null;
        this.temperatureC           = data.temperatureC           ?? null;
        this.humidityPct            = data.humidityPct            ?? null;
        this.circuitBreakerTripped  = data.circuitBreakerTripped  ?? false;
        this.relayState             = data.relayState             ?? 'Off';
        this.circuitId              = data.circuitId              ?? '';
        this.circuitLabel           = data.circuitLabel           ?? '';
        this.anomalies              = data.anomalies              ?? [];
        this.rawSnapshot            = data.rawSnapshot            ?? null;
    }
}

/**
 * RelayStatusResource — Espejo para el estado de comandos de relé.
 */
export class RelayStatusResource {
    constructor(data = {}) {
        this.relayCommandId  = data.relayCommandId  ?? data.id ?? '';
        this.executionId     = data.executionId     ?? '';
        this.relayState      = data.relayState      ?? 'Off';
        this.reason          = data.reason          ?? '';
        this.requestedAt     = data.requestedAt     ?? null;
        this.executedAt      = data.executedAt      ?? null;
        this.commandStatus   = data.commandStatus   ?? 'Pending'; // Pending | Executed | Failed
    }
}
