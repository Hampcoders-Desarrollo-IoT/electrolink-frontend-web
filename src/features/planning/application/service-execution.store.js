import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceExecutionApiService } from '../infrastructure/services/service-execution-api.service.js';
import { ServiceExecutionAssembler } from '../infrastructure/assemblers/service-execution.assembler.js';

const api = new ServiceExecutionApiService();

export const useServiceExecutionStore = defineStore('serviceExecution', () => {
    const assignedServices = ref([]);
    const history = ref([]);
    const currentExecution = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    const pendingServices = computed(() => assignedServices.value.filter(e => e.status === 'assigned'));
    const inProgressServices = computed(() => assignedServices.value.filter(e => e.status === 'in_progress'));
    const completedServices = computed(() => assignedServices.value.filter(e => e.status === 'completed'));

    async function fetchAssigned(technicianId) {
        isLoading.value = true;
        try {
            const response = await api.getAssigned(technicianId);
            if (response && response.data) {
                assignedServices.value = ServiceExecutionAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchHistory(technicianId) {
        isLoading.value = true;
        try {
            const response = await api.getHistory(technicianId);
            if (response && response.data) {
                history.value = ServiceExecutionAssembler.toEntityListFromResponse(response);
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchExecution(executionId) {
        isLoading.value = true;
        try {
            const response = await api.getById(executionId);
            if (response && response.data) {
                currentExecution.value = ServiceExecutionAssembler.toEntityFromResource(response.data);
                return currentExecution.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function startExecution(executionId) {
        isLoading.value = true;
        try {
            const response = await api.start(executionId);
            if (response && response.data) {
                currentExecution.value = ServiceExecutionAssembler.toEntityFromResource(response.data);
                return currentExecution.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function completeExecution(executionId) {
        isLoading.value = true;
        try {
            const response = await api.complete(executionId);
            if (response && response.data) {
                currentExecution.value = ServiceExecutionAssembler.toEntityFromResource(response.data);
                return currentExecution.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function cancelExecution(executionId) {
        isLoading.value = true;
        try {
            const response = await api.cancel(executionId);
            if (response && response.data) {
                currentExecution.value = ServiceExecutionAssembler.toEntityFromResource(response.data);
                return currentExecution.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    async function toggleRelay(executionId) {
        isLoading.value = true;
        try {
            const response = await api.toggleRelay(executionId);
            if (response && response.data) {
                currentExecution.value = ServiceExecutionAssembler.toEntityFromResource(response.data);
                return currentExecution.value;
            }
        } catch (error) {
            errors.value.push(error);
        } finally {
            isLoading.value = false;
        }
    }

    function selectExecution(execution) {
        currentExecution.value = execution;
    }

    return {
        assignedServices,
        history,
        currentExecution,
        isLoading,
        errors,
        pendingServices,
        inProgressServices,
        completedServices,
        fetchAssigned,
        fetchHistory,
        fetchExecution,
        startExecution,
        completeExecution,
        cancelExecution,
        toggleRelay,
        selectExecution
    };
});

export default useServiceExecutionStore;
