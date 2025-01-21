import Vue from 'vue';
import VueRouter from 'vue-router';
import error404Route from '@/layout/router';
import accountRoute from '@/modules/account/router';
import companyRoute from '@/modules/company/router';
import { keyLocalStorage } from '@/configs/global.config';

Vue.use(VueRouter);

const routes = [...error404Route, ...accountRoute, ...companyRoute];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

router.beforeEach((to, _, next) => {
    const { authorized } = to.meta;

    if (authorized) {
        const json = localStorage.getItem(keyLocalStorage);

        const currentUser = JSON.parse(json);

        if (!currentUser) {
            return next({
                path: '/signin',
                query: {
                    returnUrl: to.path
                }
            });
        }

        if (authorized.length && !authorized.includes(currentUser.role)) {
            return next({ path: '/unauthorized' });
        }
    }

    next();
});

export default router;
