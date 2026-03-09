const assetsRoutes = [
    // Owner — properties sub-domain
    { path: 'properties',           name: 'assets-properties',    component: () => import('./properties/views/properties-view.component.vue'),   meta: { title: 'Properties' }},
    { path: 'properties/portfolio', name: 'assets-portfolio',     component: () => import('./properties/views/property-portfolio.component.vue'), meta: { title: 'Property Portfolio' }},
    { path: 'properties/new',       name: 'assets-property-new',  component: () => import('./properties/views/property-form.component.vue'),      meta: { title: 'Add Property' }},
    // Technician — inventory sub-domain
    { path: 'inventory',            name: 'assets-inventory',     component: () => import('./inventory/views/inventory-view.component.vue'),       meta: { title: 'Component Inventory' }},
    { path: 'inventory/adjustments', name: 'assets-adjustments',  component: () => import('./inventory/views/inventory-adjustments.component.vue'), meta: { title: 'Inventory Adjustments' }},
];

export default assetsRoutes;
