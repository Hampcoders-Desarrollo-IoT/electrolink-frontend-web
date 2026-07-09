import useIamStore from "../../../iam/application/iam.store.js";
import {useProfilesStore} from "../../application/profiles.store.js";

/**
 * Guard to ensure users with incomplete profiles complete them before accessing the app.
 * @param to
 * @param from
 * @param next
 */
export const profileCompletionGuard = async (to, from, next) => {
    const iamStore = useIamStore();
    const profilesStore = useProfilesStore();

    // If not signed in, let authenticationGuard handle it (usually redirects to sign-in)
    if (!iamStore.isSignedIn) {
        return next();
    }

    // Admin and SuperAdmin users cannot have a business role, so skip profile completion
    if (!iamStore.isUser) {
        return next();
    }

    // Skip if navigating to the completion page or sign-out
    if (to.name === 'profiles-complete' || to.name === 'iam-sign-in') {
        return next();
    }

    try {
        // Fetch/ensure we have the status
        const statusResource = await profilesStore.fetchProfileStatus();
        
        if (statusResource && statusResource.status === 'Incomplete') {
            console.warn('Profile incomplete. Redirecting to completion page.');
            return next({ name: 'profiles-complete' });
        }
        
        // Otherwise proceed
        next();
    } catch (error) {
        console.error('Error in profile completion guard:', error);
        next(); // Proceed on error to avoid blocking the user entirely if API fails
    }
}
