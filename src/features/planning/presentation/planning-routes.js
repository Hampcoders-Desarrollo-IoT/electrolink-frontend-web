const HomeownerRequestList = () => import('./views/homeowner/request-list.component.vue');
const HomeownerRequestDetail = () => import('./views/homeowner/request-detail.component.vue');
const HomeownerRequestWizard = () => import('./views/homeowner/request-wizard.component.vue');
const HomeownerSuggestions = () => import('./views/homeowner/suggestions.component.vue');
const CompanyRequests = () => import('./views/company/company-requests.component.vue');
const TechnicianCatalog = () => import('./views/technician/catalog-management.component.vue');
const TechnicianAssignments = () => import('./views/technician/assignment-dashboard.component.vue');
const TechnicianExecution = () => import('./views/technician/execution-detail.component.vue');
const TechnicianHistory = () => import('./views/technician/service-history.component.vue');
const Unauthorized = () => import('./views/shared/unauthorized.component.vue');

const planningRoutes = [
    // Homeowner
    { path: 'requests', name: 'planning-requests', component: HomeownerRequestList, meta: { title: 'My Requests', requiredBusinessRole: 'HOMEOWNER' } },
    { path: 'requests/:id', name: 'planning-request-detail', component: HomeownerRequestDetail, meta: { title: 'Request Detail', requiredBusinessRole: 'HOMEOWNER' } },
    { path: 'requests/:id/wizard', name: 'planning-request-wizard', component: HomeownerRequestWizard, meta: { title: 'New Request', requiredBusinessRole: 'HOMEOWNER' } },
    { path: 'suggestions', name: 'planning-suggestions', component: HomeownerSuggestions, meta: { title: 'Suggestions', requiredBusinessRole: 'HOMEOWNER' } },
    // Company
    { path: 'company/requests', name: 'planning-company-requests', component: CompanyRequests, meta: { title: 'Service Requests', requiredBusinessRole: 'COMPANY' } },
    // Technician
    { path: 'catalog', name: 'planning-catalog', component: TechnicianCatalog, meta: { title: 'My Recipe Catalog', requiredBusinessRole: 'TECHNICIAN' } },
    { path: 'assignments', name: 'planning-assignments', component: TechnicianAssignments, meta: { title: 'Assignments', requiredBusinessRole: 'TECHNICIAN' } },
    { path: 'executions/:id', name: 'planning-execution-detail', component: TechnicianExecution, meta: { title: 'Execution', requiredBusinessRole: 'TECHNICIAN' } },
    { path: 'history', name: 'planning-history', component: TechnicianHistory, meta: { title: 'Service History', requiredBusinessRole: 'TECHNICIAN' } },
    // Shared
    { path: 'unauthorized', name: 'planning-unauthorized', component: Unauthorized, meta: { title: 'Access Denied' } },
];

export default planningRoutes;
