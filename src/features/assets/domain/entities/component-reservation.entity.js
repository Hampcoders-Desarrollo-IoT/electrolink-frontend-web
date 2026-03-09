export class ComponentReservation {
    constructor({
        id = '',
        technicianInventoryId = '',
        serviceId = '',
        expiresAt = '',
        isConsumed = false,
        isReleased = false,
        consumedAt = null,
        releasedAt = null,
        items = []
    } = {}) {
        this.id = id;
        this.technicianInventoryId = technicianInventoryId;
        this.serviceId = serviceId;
        this.expiresAt = expiresAt;
        this.isConsumed = isConsumed;
        this.isReleased = isReleased;
        this.consumedAt = consumedAt;
        this.releasedAt = releasedAt;
        this.items = items;
    }

    get isExpired() {
        if (this.isConsumed || this.isReleased || !this.expiresAt) return false;
        return new Date() > new Date(this.expiresAt);
    }
}
