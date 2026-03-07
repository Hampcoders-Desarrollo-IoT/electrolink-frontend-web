const signIn = () => import('./views/sign-in.component.vue');
const signUp = () => import('./views/sign-up.component.vue');
const passwordRecovery = () => import('./views/password-recovery.component.vue');

const iamRoutes = [
    {path: 'sign-in', name: 'iam-sign-in', component: signIn, meta: {title: 'Sign In'}},
    {path: 'sign-up', name: 'iam-sign-up', component: signUp, meta: {title: 'Sign Up'}},
    {path: 'password-recovery', name: 'iam-password-recovery', component: passwordRecovery, meta: {title: 'Password Recovery'}},
];

export default iamRoutes;