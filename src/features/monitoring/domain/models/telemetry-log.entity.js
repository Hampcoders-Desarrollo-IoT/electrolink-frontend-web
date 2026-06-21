/**
 * TelemetryLog — Domain Entity
 * Immutable snapshot of IoT sensor readings captured at service start.
 */
export class TelemetryLog {
    constructor({
        logId = '',
        executionId = '',
        capturedAt = null,
        // Electrical circuit readings
        voltageV = null,
        currentA = null,
        powerW = null,
        frequencyHz = null,
        powerFactorPf = null,
        // Environment
        temperatureC = null,
        humidityPct = null,
        // Circuit breaker / relay state
        circuitBreakerTripped = false,
        relayState = 'Off',            // On | Off
        circuitId = '',
        circuitLabel = '',
        // Anomalies detected
        anomalies = [],                // [{ code, description, severity }]
        // Raw snapshot blob (optional, for debugging)
        rawSnapshot = null,
    } = {}) {
        this.logId = logId;
        this.executionId = executionId;
        this.capturedAt = capturedAt ? new Date(capturedAt) : null;
        this.voltageV = voltageV;
        this.currentA = currentA;
        this.powerW = powerW;
        this.frequencyHz = frequencyHz;
        this.powerFactorPf = powerFactorPf;
        this.temperatureC = temperatureC;
        this.humidityPct = humidityPct;
        this.circuitBreakerTripped = circuitBreakerTripped;
        this.relayState = relayState;
        this.circuitId = circuitId;
        this.circuitLabel = circuitLabel;
        this.anomalies = anomalies;
        this.rawSnapshot = rawSnapshot;
    }

    get hasAnomalies() { return this.anomalies.length > 0; }

    get criticalAnomalies() {
        return this.anomalies.filter(a => a.severity === 'Critical');
    }

    get highestSeverity() {
        if (this.anomalies.some(a => a.severity === 'Critical'))   return 'Critical';
        if (this.anomalies.some(a => a.severity === 'High'))       return 'High';
        if (this.anomalies.some(a => a.severity === 'Medium'))     return 'Medium';
        if (this.anomalies.some(a => a.severity === 'Low'))        return 'Low';
        return 'None';
    }

    get severityColor() {
        const map = {
            Critical: '#ef4444',
            High:     '#f97316',
            Medium:   '#ffe492',
            Low:      '#10b981',
            None:     '#10b981',
        };
        return map[this.highestSeverity] ?? '#6b7280';
    }
}
