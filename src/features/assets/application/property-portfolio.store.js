import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PropertyPortfolioApiService } from '../infrastructure/services/property-portfolio-api.service.js';
import { PropertyPortfolioAssembler } from '../infrastructure/assemblers/property-portfolio.assembler.js';

const portfolioApi = new PropertyPortfolioApiService();

export const usePropertyPortfolioStore = defineStore('propertyPortfolio', () => {
    const portfolio = ref(null);
    const isLoading = ref(false);
    const errors = ref([]);

    async function loadPortfolio(homeownerId) {
        isLoading.value = true;
        try {
            const response = await portfolioApi.getAll(homeownerId);
            if (response && response.data) {
                portfolio.value = PropertyPortfolioAssembler.toEntityFromResource(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading portfolio:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function addPropertyToPortfolio(homeownerId, command) {
        isLoading.value = true;
        try {
            const response = await portfolioApi.addProperty(homeownerId, command);
            if (response && response.data) {
                portfolio.value = PropertyPortfolioAssembler.toEntityFromResource(response.data);
                return portfolio.value;
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error adding property to portfolio:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function removePropertyFromPortfolio(homeownerId, propertyId, reason = '') {
        isLoading.value = true;
        try {
            await portfolioApi.removeProperty(homeownerId, propertyId, reason);
            if (portfolio.value && portfolio.value.properties) {
                portfolio.value.properties = portfolio.value.properties.filter(e => e.propertyId !== propertyId);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error removing property from portfolio:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        portfolio,
        isLoading,
        errors,
        loadPortfolio,
        addPropertyToPortfolio,
        removePropertyFromPortfolio
    };
});

export default usePropertyPortfolioStore;
