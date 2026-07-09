import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceRequestApiService } from '../infrastructure/services/service-request-api.service.js';
import { ServiceRequestAssembler } from '../infrastructure/assemblers/service-request.assembler.js';
import { AvailableServiceAssembler } from '../infrastructure/assemblers/available-service.assembler.js';

const api = new ServiceRequestApiService();

export const useServiceRequestStore = defineStore('serviceRequest', () => {
    const currentRequest = ref(null);
    const requests = ref([]);
    const availableServices = ref([]);
    const eligibility = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    const isEligible = computed(() => eligibility.value?.eligible ?? false);
    const remainingRequests = computed(() => eligibility.value?.remainingRequests ?? 0);

    async function fetchEligibility() {
        isLoading.value = true;
        try {
            const response = await api.getEligibility();
            if (response && response.data) {
                eligibility.value = response.data;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function initiateRequest(command) {
        isLoading.value = true;
        try {
            const response = await api.create(command);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function selectProperty(requestId, resource) {
        isLoading.value = true;
        try {
            const response = await api.selectProperty(requestId, resource);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchAvailableServices(requestId) {
        isLoading.value = true;
        try {
            const response = await api.getAvailableServices(requestId);
            if (response && response.data) {
                availableServices.value = AvailableServiceAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function selectCategory(requestId, resource) {
        isLoading.value = true;
        try {
            const response = await api.selectRecipe(requestId, resource);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function addDetails(requestId, resource) {
        isLoading.value = true;
        try {
            const response = await api.addDetails(requestId, resource);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function confirmRequest(requestId) {
        isLoading.value = true;
        try {
            const response = await api.confirm(requestId);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchRequest(requestId) {
        isLoading.value = true;
        try {
            const response = await api.getById(requestId);
            if (response && response.data) {
                currentRequest.value = ServiceRequestAssembler.toEntityFromResource(response.data);
                return currentRequest.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function cancelRequest(requestId) {
        isLoading.value = true;
        try {
            await api.delete(requestId);
            currentRequest.value = null;
            requests.value = requests.value.filter(r => r.requestId !== requestId);
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchRequests() {
        isLoading.value = true;
        try {
            const response = await api.getAllRequests();
            if (response && response.data) {
                requests.value = ServiceRequestAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        currentRequest,
        requests,
        availableServices,
        eligibility,
        isLoading,
        errors,
        isEligible,
        remainingRequests,
        fetchEligibility,
        fetchRequests,
        initiateRequest,
        selectProperty,
        fetchAvailableServices,
        selectCategory,
        addDetails,
        confirmRequest,
        fetchRequest,
        cancelRequest
    };
});

export default useServiceRequestStore;
