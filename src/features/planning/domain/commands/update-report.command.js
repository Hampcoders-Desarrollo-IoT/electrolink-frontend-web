export class UpdateReportCommand {
    constructor({ executionId, report }) {
        this.executionId = executionId;
        this.report = report;
    }
}
