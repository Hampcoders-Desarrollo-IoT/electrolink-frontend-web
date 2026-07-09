export class ServiceSuggestion {
    constructor({
        suggestionId = '',
        clientId = '',
        clientType = '',
        propertyId = '',
        title = '',
        description = '',
        severity = '',
        category = '',
        isViewed = false,
        isAccepted = false,
        isDismissed = false,
        createdAt = null,
        metadata = {}
    } = {}) {
        this.suggestionId = suggestionId;
        this.clientId = clientId;
        this.clientType = clientType;
        this.propertyId = propertyId;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.category = category;
        this.isViewed = isViewed;
        this.isAccepted = isAccepted;
        this.isDismissed = isDismissed;
        this.createdAt = createdAt;
        this.metadata = metadata;
    }
}
