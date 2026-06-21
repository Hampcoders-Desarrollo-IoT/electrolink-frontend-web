import {IamApiService} from "../infrastructure/services/iam-api.service.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "../infrastructure/assembler/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/assembler/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/assembler/sign-up.assembler.js";
import {RefreshClaimsAssembler} from "../infrastructure/assembler/refresh-claims.assembler.js";
import {RefreshClaimsCommand} from "../domain/commands/refresh-claims.command.js";
import {ProfilesApi} from "../../profiles/infrastructure/services/profiles-api.service.js";

import {useProfilesStore} from "../../profiles/application/profiles.store.js";

const iamApi = new IamApiService();
const profilesApi = new ProfilesApi();

const useIamStore = defineStore('iam', () => {
    const users = ref([]);
    const errors = ref([]);
    const usersLoaded = ref(false);
    const isSignedIn = ref(!!localStorage.getItem('token'));
    const currentUsername = ref(null);
    const currentUserId = ref('');
    const currentToken = computed(() => localStorage.getItem('token'));

    const decodedToken = computed(() => {
        const token = currentToken.value;
        if (!token) return null;
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error decoding JWT:', e);
            return null;
        }
    });

    const roleSubjectId = computed(() => decodedToken.value?.roleSubjectId);
    const profileId = computed(() => decodedToken.value?.profileId);
    const currentAccessRole = computed(() => decodedToken.value?.role || null);

    function signIn(signInCommand, router) {
        console.log(signInCommand);
        iamApi.signIn(signInCommand)
            .then(response => {
                let signInResource = SignInAssembler.toResourceFromResponse(response);
                if (signInResource) {
                    let currentUser = UserAssembler.toEntityFromResource(signInResource);
                    currentUsername.value = currentUser.username;
                    currentUserId.value = currentUser.id;
                    
                    localStorage.setItem('token', signInResource.token);
                    
                    isSignedIn.value = true;
                    console.log(`User ${currentUsername.value} signed in successfully.`);
                    errors.value = [];

                    const profilesStore = useProfilesStore();
                    profilesStore.fetchProfileStatus().then(async (statusResource) => {
                        if (statusResource && statusResource.status === 'Incomplete') {
                            router.push({ name: 'profiles-complete' });
                        } else {
                            await profilesStore.loadProfile(currentUserId.value);
                            router.push({ name: 'home' });
                        }
                    }).catch(() => {
                        router.push({ name: 'home' });
                    });
                } else {
                    isSignedIn.value = false;
                    console.log(`Sign-in failed: Invalid response.`);
                    errors.value.push(new Error("Invalid response."));
                    router.push({name: 'iam-sign-in'});
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUsername.value = '';
                currentUserId.value = 0;
                console.log(`Sign-in failed: ${error.message}`);
                errors.value.push(error);
                router.push({name: 'iam-sign-in'});
            });
    }

    function signUp(signUpCommand, router) {
        iamApi.signUp(signUpCommand)
            .then(response => {
                let signUpResource = SignUpAssembler.toResourceFromResponse(response);
                if (signUpResource) {
                    currentUsername.value = signUpResource.email;
                    currentUserId.value = signUpResource.userId;
                    localStorage.setItem('token', signUpResource.token);
                    isSignedIn.value = true;
                    console.log(`User ${currentUsername.value} (ID: ${currentUserId.value}) signed up and authenticated successfully.`);
                    console.log('Stored Token:', signUpResource.token);
                    errors.value = [];
                    
                    router.push({ name: 'profiles-complete' });
                } else {
                    isSignedIn.value = false;
                    console.log(`Sign-up failed: Invalid response.`);
                    errors.value.push(new Error("Invalid response."));
                    router.push({ name: 'iam-sign-up' });
                }
            })
            .catch(error => {
                isSignedIn.value = false;
                currentUsername.value = '';
                currentUserId.value = '';
                console.log(`Sign-up failed: ${error.message}`);
                errors.value.push(error);
                router.push({ name: 'iam-sign-up' });
            })
    }

    function refreshClaims() {
        const command = new RefreshClaimsCommand();
        return iamApi.refreshClaims(command)
            .then(response => {
                const resource = RefreshClaimsAssembler.toResourceFromResponse(response);
                if (resource) {
                    localStorage.setItem('token', resource.token);
                    console.log('Token claims refreshed successfully.');
                    errors.value = [];
                } else {
                    console.error('Refresh claims failed: Invalid response.');
                    errors.value.push(new Error('Invalid response from refresh-claims.'));
                }
                return resource;
            })
            .catch(error => {
                console.error('Refresh claims failed:', error.message);
                errors.value.push(error);
                return null;
            });
    }

    function signOut(router) {
        currentUsername.value = '';
        currentUserId.value = '';
        localStorage.removeItem('token');
        isSignedIn.value = false;
        errors.value = [];
        console.log(`User signed out successfully.`);
        router.push({name: 'iam-sign-in'});
    }

    async function validateSession() {
        if (!currentToken.value) return;
        
        try {
            const response = await profilesApi.getMyProfile();
            if (response.data) {
                // Map profile/user data back to state
                currentUsername.value = response.data.email || 'User';
                currentUserId.value = response.data.userId || response.data.id;
                isSignedIn.value = true;
                console.log(`Session validated for ${currentUsername.value} (ID: ${currentUserId.value})`);

                // Load full profile into profiles store
                const profilesStore = useProfilesStore();
                // We use 'me' to ensure we get the logged-in user profile
                await profilesStore.loadProfile('me');

                // Check profile status on validation
                const statusResource = await profilesStore.fetchProfileStatus();
                if (statusResource && statusResource.status === 'Incomplete') {
                    return 'INCOMPLETE';
                }
            }
        } catch (error) {
            console.error('Session validation failed:', error.message);
            isSignedIn.value = false;
            localStorage.removeItem('token');
        }
    }

    return {
        users,
        errors,
        usersLoaded,
        isSignedIn,
        currentUsername,
        currentUserId,
        currentToken,
        roleSubjectId,
        profileId,
        currentAccessRole,
        signIn,
        signUp,
        refreshClaims,
        signOut,
        validateSession
    };
});

export default useIamStore;