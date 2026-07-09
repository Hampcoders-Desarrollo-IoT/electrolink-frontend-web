import { BaseApi } from '@/shared/infrastructure/apis/base-api.js';

const suggestionsPath = import.meta.env.VITE_SUGGESTIONS_ENDPOINT_PATH;

export class ServiceSuggestionApiService extends BaseApi {
    constructor() {
        super();
    }

    getAll(clientType) {
        const params = clientType ? { clientType } : {};
        return this.http.get(suggestionsPath, { params });
    }

    markAsViewed(suggestionId) {
        return this.http.patch(`${suggestionsPath}/${suggestionId}/viewed`);
    }

    accept(suggestionId) {
        return this.http.post(`${suggestionsPath}/${suggestionId}/accept`);
    }

    dismiss(suggestionId) {
        return this.http.post(`${suggestionsPath}/${suggestionId}/dismiss`);
    }
}
