import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ProfilesApi } from '../infrastructure/services/profiles-api.service.js';
import { ProfileAssembler } from '../infrastructure/assemblers/profile.assembler.js';
import useIamStore from '../../iam/application/iam.store.js';

const profilesApi = new ProfilesApi();

export const useProfilesStore = defineStore('profilesV2', () => {
    console.log('Profiles store initializing v4 (COMPANY support)...');
    const profile = ref(null);
    const profileStatus = ref(null);
    const isLoading = ref(false);
    const isProfileComplete = computed(() => profile.value?.status === 'Active');
    const isProfileIncomplete = computed(() => profileStatus.value?.status === 'Incomplete');
    const errors = ref([]);

    async function loadProfile(userId) {
        isLoading.value = true;
        try {
            const response = await profilesApi.getMyProfile();
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
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error completing technician profile:', error.message);
            }
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
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error completing homeowner profile:', error.message);
            }
        } finally {

            isLoading.value = false;
        }
    }

    async function completeProfileAsCompany(command, router) {
        console.log('Action: completeProfileAsCompany', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.completeProfileAsCompany(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Company profile completed successfully');
                errors.value = [];
                router.push({ name: 'profiles-management' });
                return true;
            }
            return false;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error completing company profile:', error.message);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function updatePersonalData(command) {
        console.log('Action: updatePersonalData', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.patchPersonalData(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Personal data updated successfully');
                errors.value = [];
                return true;
            }
            return false;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error updating personal data:', error.message);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function updateTechnicianData(command) {
        console.log('Action: updateTechnicianData', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.patchTechnicianData(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Technician data updated successfully');
                errors.value = [];
                return true;
            }
            return false;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error updating technician data:', error.message);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function updateHomeownerData(command) {
        console.log('Action: updateHomeownerData', command);
        isLoading.value = true;
        try {
            const response = await profilesApi.patchHomeownerData(command);
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Homeowner data updated successfully');
                errors.value = [];
                return true;
            }
            return false;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error updating homeowner data:', error.message);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function deactivateProfile(command) {
        console.log('Action: deactivateProfile', command);
        isLoading.value = true;
        try {
            await profilesApi.deactivateProfile(command);
            console.log('Profile deactivated successfully');
            errors.value = [];
            if (profile.value) {
                profile.value.status = 'Inactive';
            }
            return true;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error deactivating profile:', error.message);
            }
        } finally {
            isLoading.value = false;
        }
    }

    async function reactivateProfile() {
        console.log('Action: reactivateProfile');
        isLoading.value = true;
        try {
            const response = await profilesApi.reactivateProfile();
            if (response && response.data) {
                profile.value = ProfileAssembler.toEntityFromResource(response.data);
                console.log('Profile reactivated successfully');
                errors.value = [];
                return true;
            }
            return false;
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const msg = error.response.data?.message || 'Error desconocido';
                errors.value = [{ status, message: msg }];
                console.error(`HTTP ${status}: ${msg}`);
            } else {
                errors.value.push(error);
                console.error('Error reactivating profile:', error.message);
            }
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
                phoneNumber: formData.phone
            });
            return await completeProfileAsHomeowner(command, { push: () => true });
        } else if (formData.role === 'TECHNICIAN') {
            const { CompleteProfileAsTechnicianCommand } = await import('../domain/commands/complete-profile-technician.command.js');
            const command = new CompleteProfileAsTechnicianCommand({
                ...formData,
                email,
                dateOfBirth: formatDate(formData.dateOfBirth),
                phoneNumber: formData.phone
            });
            return await completeProfileAsTechnician(command, { push: () => true });
        } else {
            const { CompleteProfileAsCompanyCommand } = await import('../domain/commands/complete-profile-company.command.js');
            const command = new CompleteProfileAsCompanyCommand({
                ...formData,
                email,
                dateOfBirth: formData.dateOfBirth ? formatDate(formData.dateOfBirth) : '',
                phoneNumber: formData.phone
            });
            return await completeProfileAsCompany(command, { push: () => true });
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
        completeProfileAsCompany,
        updatePersonalData,
        updateTechnicianData,
        updateHomeownerData,
        deactivateProfile,
        reactivateProfile,
        createProfileV2
    };
});

export default useProfilesStore;
