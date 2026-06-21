import useIamStore from "../../application/iam.store.js";

export const authorizationGuard = (to, from, next) => {
    const store = useIamStore();

    if (to.meta.accessRole) {
        if (!store.isSignedIn) {
            return next({ name: 'iam-sign-in' });
        }
        const userAccessRole = store.currentAccessRole;
        if (userAccessRole !== to.meta.accessRole) {
            console.warn(`Access denied. Required role: ${to.meta.accessRole}, user role: ${userAccessRole}`);
            return next({ name: 'page-not-found' });
        }
    }

    next();
}
