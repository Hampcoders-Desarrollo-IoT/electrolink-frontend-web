import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ProfilesApi } from '../infrastructure/services/profiles-api.service.js';
import { ProfileAssembler } from '../infrastructure/assemblers/profile.assembler.js';
import useIamStore from '../../iam/application/iam.store.js';

const profilesApi = new ProfilesApi();

// Renamed store identity to force refresh in browser
export const useProfilesStore = defineStore('profilesV2', () => {
    console.log('Profiles store initializing v3 (Nested Entities Support)...');
    const profile = ref(null);
    const profileStatus = ref(null);
    const isLoading = ref(false);
    const isProfileComplete = computed(() => profile.value?.status === 'Active');
    const isProfileIncomplete = computed(() => profileStatus.value?.status === 'Incomplete');
    const errors = ref([]);

    async function loadProfile(userId) {
        isLoading.value = true;
        try {
            const response = await profilesApi.getProfile(userId);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
            }
        } catch (error) {
            errors.value.push(error);
            console.error('Error loading profile:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function completeProfileAsTechnician(command, router) {
        console.log('Action: completeProfileAsTechnician', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.completeProfileAsTechnician(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Technician profile completed successfully');
                errors.value = [];
                router.push({ name: 'profiles-management' });
                return true;
            }
            return false;
        } catch (error) {
            errors.value.push(error);
            console.error('Error completing technician profile:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function completeProfileAsHomeowner(command, router) {
        console.log('Action: completeProfileAsHomeowner', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.completeProfileAsHomeowner(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Homeowner profile completed successfully');
                errors.value = [];
                router.push({ name: 'profiles-management' });
                return true;
            }
            return false;
        } catch (error) {
            errors.value.push(error);
            console.error('Error completing homeowner profile:', error.message);
        } finally {
            isLoading.value = false;
        }
    }

    async function fetchProfileStatus() {
        try {
            const response = await profilesApi.getProfileStatus();
            profileStatus.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error fetching profile status:', error.message);
            return null;
        }
    }

    async function createProfileV2(formData) {
        const iamStore = useIamStore();
        const email = iamStore.currentUsername;

        const formatDate = (date) => {
            if (!date) return '2000-01-01';
            if (typeof date === 'string') return date;
            const d = new Date(date);
            return d.toISOString().split('T')[0];
        };

        if (formData.role === 'HOMEOWNER') {
            const { CompleteProfileAsHomeownerCommand } = await import('../domain/commands/complete-profile-homeowner.command.js');
            const command = new CompleteProfileAsHomeownerCommand({
                ...formData,
                email,
                dateOfBirth: formatDate(formData.dateOfBirth),
                phoneNumber: formData.phone // Mapping phone -> phoneNumber for API
            });
            return await completeProfileAsHomeowner(command, { push: () => true }); // Dummy router since V2 caller handles it
        } else {
            const { CompleteProfileAsTechnicianCommand } = await import('../domain/commands/complete-profile-technician.command.js');
            const command = new CompleteProfileAsTechnicianCommand({
                ...formData,
                email,
                dateOfBirth: formatDate(formData.dateOfBirth),
                phoneNumber: formData.phone // Mapping phone -> phoneNumber for API
            });
            return await completeProfileAsTechnician(command, { push: () => true });
        }
    }

    return {
        profile,
        profileStatus,
        isLoading,
        isProfileComplete,
        isProfileIncomplete,
        errors,
        loadProfile,
        fetchProfileStatus,
        completeProfileAsTechnician,
        completeProfileAsHomeowner,
        createProfileV2
    };
});

export default useProfilesStore;
