import useIamStore from "../../application/iam.store.js";
import { profileCompletionGuard } from "../../../profiles/infrastructure/services/profile-completion.guard.js";

export const authenticationGuard = (to, from, next) => {
    const store = useIamStore();
    const isAnonymous = !store.isSignedIn;
    const publicRoutes = ['/iam/sign-in', '/iam/sign-up', '/about', '/page-not-found'];
    const routeRequiresToBeAuthenticated = !publicRoutes.includes(to.path);
    if (isAnonymous && routeRequiresToBeAuthenticated) return next({ name: 'iam-sign-in'});

    // Check access role authorization
    if (to.meta.accessRole) {
        const userAccessRole = store.currentAccessRole;
        if (userAccessRole !== to.meta.accessRole) {
            console.warn(`Access denied. Required role: ${to.meta.accessRole}, user role: ${userAccessRole}`);
            return next({ name: 'page-not-found' });
        }
    }
    
    // If authenticated and authorized, check for profile completion
    profileCompletionGuard(to, from, next);
}