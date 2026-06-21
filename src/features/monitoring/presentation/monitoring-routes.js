/**
 * monitoring-routes.js — Definición y registro de rutas del módulo de monitoreo.
 *
 * Acceso restringido únicamente a usuarios con accessRole === 'USER'.
 * Los roles ADMIN y SUPERADMIN son bloqueados a nivel de componente.
 */

const serviceMonitoring = () =>
    import('./views/service-monitoring.component.vue');

const monitoringRoutes = [
    {
        path: 'monitoring',
        name: 'service-monitoring',
        component: serviceMonitoring,
        meta: {
            title: 'Service Monitoring',
            requiresAuth: true,
        },
    },
];

export default monitoringRoutes;
