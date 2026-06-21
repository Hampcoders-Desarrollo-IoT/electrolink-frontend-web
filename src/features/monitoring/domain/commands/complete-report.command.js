/**
 * CompleteReportCommand — Cierra y finaliza la orden de trabajo (irreversible).
 * Requiere que previamente existan fotos e informe técnico.
 */
export class CompleteReportCommand {
    /**
     * @param {string} executionId
     * @param {{ reportContent: string, findings: string, recommendations: string, iotFindings: string }} reportData
     */
    constructor(executionId, reportData = {}) {
        this.executionId = executionId;
        this.reportContent    = reportData.reportContent    ?? '';
        this.findings         = reportData.findings         ?? '';
        this.recommendations  = reportData.recommendations  ?? '';
        this.iotFindings      = reportData.iotFindings      ?? '';
        this.updatedAt        = new Date().toISOString();
    }

    toReportPayload() {
        return {
            reportContent:   this.reportContent,
            findings:        this.findings,
            recommendations: this.recommendations,
            iotFindings:     this.iotFindings,
            updatedAt:       this.updatedAt,
        };
    }

    toCompletePayload() {
        return {};
    }
}
