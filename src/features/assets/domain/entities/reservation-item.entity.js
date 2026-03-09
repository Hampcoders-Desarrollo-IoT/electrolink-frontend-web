export class ReservationItem {
    constructor({
        id = '',
        reservationId = '',
        componentId = '',
        quantity = 0
    } = {}) {
        this.id = id;
        this.reservationId = reservationId;
        this.componentId = componentId;
        this.quantity = quantity;
    }
}
