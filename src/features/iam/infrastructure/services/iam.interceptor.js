export const iamInterceptor = (config) => {
    const token = localStorage.getItem('token');
    
    // Skip adding token for authentication endpoints
    const isAuthRequest = config.url.includes('/authentication/sign-up') || 
                         config.url.includes('/authentication/sign-in');

    if (token && !isAuthRequest) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`[IAM Interceptor] Token attached to ${config.url}`);
    } else {
        console.log(`[IAM Interceptor] No token attached or skipped for ${config.url}`);
    }
    return config;
}