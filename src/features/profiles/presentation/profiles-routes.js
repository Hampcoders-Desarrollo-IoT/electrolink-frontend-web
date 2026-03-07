const profileManagement = () => import('./views/profile-management.component.vue');
const completeProfile = () => import('./views/complete-profile.component.vue');

const profilesRoutes = [
    {path: 'management', name: 'profiles-management', component: profileManagement, meta: {title: 'My Profile'}},
    {path: 'complete', name: 'profiles-complete', component: completeProfile, meta: {title: 'Complete Profile'}},
];

export default profilesRoutes;
