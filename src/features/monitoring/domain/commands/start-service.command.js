/**
 * StartServiceCommand — Inicia formalmente el servicio en el sitio.
 */
export class StartServiceCommand {
    /**
     * @param {string} executionId
     */
    constructor(executionId) {
        this.executionId = executionId;
        this.startedAt = new Date().toISOString();
    }

    toPayload() {
        return { startedAt: this.startedAt };
    }
}
