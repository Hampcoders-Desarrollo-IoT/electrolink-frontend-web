/**
 * ServiceOrderResource — Espejo de la estructura de transferencia de datos de la API
 * para una ejecución de servicio (service-execution).
 * Preserva las claves tal como llegan del backend (camelCase del API contract).
 */
export class ServiceOrderResource {
    constructor(data = {}) {
        this.executionId               = data.executionId               ?? data.id                 ?? '';
        this.serviceRequestId          = data.serviceRequestId          ?? '';
        this.technicianId              = data.technicianId              ?? '';
        this.technicianName            = data.technicianName            ?? '';
        this.clientId                  = data.clientId                  ?? '';
        this.clientName                = data.clientName                ?? '';
        this.propertyId                = data.propertyId                ?? '';
        this.propertyAddress           = data.propertyAddress           ?? '';
        this.status                    = data.status                    ?? 'Scheduled';
        this.currentStep               = data.currentStep               ?? 0;
        this.scheduledDate             = data.scheduledDate             ?? null;
        this.scheduledTime             = data.scheduledTime             ?? '';
        this.startedAt                 = data.startedAt                 ?? null;
        this.completedAt               = data.completedAt               ?? null;
        this.cancelledAt               = data.cancelledAt               ?? null;
        this.cancelReason              = data.cancelReason              ?? '';
        this.estimatedDurationMinutes  = data.estimatedDurationMinutes  ?? 60;
        this.serviceType               = data.serviceType               ?? '';
        this.specialties               = data.specialties               ?? [];
        this.reportContent             = data.reportContent             ?? '';
        this.findings                  = data.findings                  ?? '';
        this.recommendations           = data.recommendations           ?? '';
        this.iotFindings               = data.iotFindings               ?? '';
        this.photosCount               = data.photosCount               ?? 0;
        this.componentsUsed            = data.componentsUsed            ?? [];
        this.totalCost                 = data.totalCost                 ?? 0;
        this.currency                  = data.currency                  ?? 'USD';
        this.technicianRating          = data.technicianRating          ?? null;
        this.clientRating              = data.clientRating              ?? null;
        this.waitExtensionMinutes      = data.waitExtensionMinutes      ?? 0;
    }
}
