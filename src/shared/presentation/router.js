import {createRouter, createWebHistory} from "vue-router";
import Home from "./views/home.vue";
import {authenticationGuard} from "@/features/iam/infrastructure/services/authentication.guard.js";
import iamRoutes from "@/features/iam/presentation/iam-routes.js";
import profilesRoutes from "@/features/profiles/presentation/profiles-routes.js";
const about = () => import('./views/about.vue');
const pageNotFound = () => import('./views/page-not-found.vue');


const routes = [
    { path: "/home",                name: 'home',       component: Home,            meta: {title: 'Home'}},
    { path: "/about",               name: 'about',      component: about,           meta: {title: 'About'}},
    { path: '/iam',                 name: 'iam',        children: iamRoutes},
    { path: '/profiles',             name: 'profiles',   children: profilesRoutes},
    { path: "/",                    redirect: "/home"},
    { path: "/:pathMatch(.*)*",     name: 'not-found',  component: pageNotFound,    meta: {title: 'Page Not Found'}}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: routes
});


router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name} to ${to.name}`);
    let baseTitle = 'ElectroLink';
    document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
    // Call authentication guard
    authenticationGuard(to, from, next);
});

export default router;