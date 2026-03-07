import useIamStore from "../../application/iam.store.js";

export const iamInterceptor = (config) => {
    const store = useIamStore();
    
    // Skip adding token for authentication endpoints
    const isAuthRequest = config.url.includes('/authentication/sign-up') || 
                         config.url.includes('/authentication/sign-in');

    if (store.isSignedIn && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${store.currentToken}`;
        console.log(`[IAM Interceptor] Token attached to ${config.url}`);
    } else {
        console.log(`[IAM Interceptor] No token attached or skipped for ${config.url}`);
    }
    return config;
}