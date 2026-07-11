/**
 * Subscription Module Routes
 * All routes within this module are lazy-loaded.
 * These are children routes, meant to be nested under the Layout route
 * in the shared router (router.js).
 */
const subscriptionRoutes = [
    {
        path:      'management',
        name:      'subscriptions-management',
        component: () => import('./views/subscription-management.component.vue'),
        meta: {
            title:         'Subscription Management',
            requiresAuth:  true,
        },
    },
];

export default subscriptionRoutes;
