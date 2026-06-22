import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceSuggestionApiService } from '../infrastructure/services/service-suggestion-api.service.js';
import { ServiceSuggestionAssembler } from '../infrastructure/assemblers/service-suggestion.assembler.js';

const api = new ServiceSuggestionApiService();

export const useServiceSuggestionStore = defineStore('serviceSuggestion', () => {
    const suggestions = ref([]);
    const isLoading = ref(false);
    const errors = ref([]);

    const unreadCount = computed(() => suggestions.value.filter(s => !s.isViewed).length);
    const criticalSuggestions = computed(() => suggestions.value.filter(s => s.severity === 'critical' || s.severity === 'high'));

    async function fetchSuggestions(clientType) {
        isLoading.value = true;
        try {
            const response = await api.getAll(clientType);
            if (response && response.data) {
                suggestions.value = ServiceSuggestionAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function markAsViewed(suggestionId) {
        try {
            await api.markAsViewed(suggestionId);
            const suggestion = suggestions.value.find(s => s.suggestionId === suggestionId);
            if (suggestion) suggestion.isViewed = true;
        } catch (error) {
            errors.value.push(error);
        }
    }

    async function acceptSuggestion(suggestionId) {
        isLoading.value = true;
        try {
            await api.accept(suggestionId);
            suggestions.value = suggestions.value.filter(s => s.suggestionId !== suggestionId);
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function dismissSuggestion(suggestionId) {
        isLoading.value = true;
        try {
            await api.dismiss(suggestionId);
            suggestions.value = suggestions.value.filter(s => s.suggestionId !== suggestionId);
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        suggestions,
        isLoading,
        errors,
        unreadCount,
        criticalSuggestions,
        fetchSuggestions,
        markAsViewed,
        acceptSuggestion,
        dismissSuggestion
    };
});

export default useServiceSuggestionStore;
