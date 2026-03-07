import {IamApiService} from "../infrastructure/services/iam-api.service.js";
import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {SignInAssembler} from "../infrastructure/assembler/sign-in.assembler.js";
import {UserAssembler} from "../infrastructure/assembler/user.assembler.js";
import {SignUpAssembler} from "../infrastructure/assembler/sign-up.assembler.js";
import {ProfilesApi} from "../../profiles/infrastructure/profiles-api.js";

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

                    // Check profile status
                    const profilesStore = useProfilesStore();
                    profilesStore.fetchProfileStatus().then(statusResource => {
                        if (statusResource && statusResource.status === 'Incomplete') {
                            router.push({ name: 'profiles-complete' });
                        } else {
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

    function signUp(signUpCommand, role, router) {
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
                    
                    router.push({ name: 'profiles-complete', query: { role: role.toUpperCase() } });
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
            // Map profile/user data back to state
            // Assuming currentUsername is email and currentUserId is userId
            if (response.data) {
                currentUsername.value = response.data.email || 'User';
                currentUserId.value = response.data.userId || response.data.id;
                isSignedIn.value = true;
                console.log(`Session validated for ${currentUsername.value}`);

                // Check profile status on validation
                const profilesStore = useProfilesStore();
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
        signIn,
        signUp,
        signOut,
        validateSession
    };
});

export default useIamStore;