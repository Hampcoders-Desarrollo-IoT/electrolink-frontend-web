const assetsRoutes = [
    // Technician — inventory & catalog sub-domains
    { path: 'technicians/:technicianId/components', name: 'assets-technician-components', component: () => import('./component-catalog/views/component-catalog-view.component.vue'), meta: { title: 'All Components' }},
    { path: 'technicians/:technicianId/component-types', name: 'assets-technician-component-types', component: () => import('./component-types/views/component-types-view.component.vue'), meta: { title: 'Component Types' }},
    
    // Homeowner — properties sub-domain
    { path: 'homeowners/:homeownerId/properties', name: 'assets-homeowner-properties', component: () => import('./properties/views/properties-view.component.vue'), meta: { title: 'Properties' } },
    { path: 'homeowners/:homeownerId/properties/dashboard', name: 'assets-homeowner-properties-dashboard', component: () => import('./properties/views/property-portfolio.component.vue'), meta: { title: 'Property Portfolio Dashboard' } },
    
    // Technician — inventory sub-domain
    { path: 'technicians/:technicianId/inventory', name: 'assets-technician-inventory', component: () => import('./inventory/views/inventory-view.component.vue'), meta: { title: 'My Inventory' }},
];

export default assetsRoutes;
