export class ServiceAssignment {
    constructor({
        assignmentId = '',
        requestId = '',
        technicianId = '',
        technicianName = '',
        score = 0,
        status = '',
        assignedAt = null,
        estimatedArrival = null
    } = {}) {
        this.assignmentId = assignmentId;
        this.requestId = requestId;
        this.technicianId = technicianId;
        this.technicianName = technicianName;
        this.score = score;
        this.status = status;
        this.assignedAt = assignedAt;
        this.estimatedArrival = estimatedArrival;
    }
}
