const Error404 = () => import('../views/Error404.vue');
const Unauthorized = () => import('../views/Unauthorized.vue');

export default [
    { name: 'error404', path: '*', component: Error404 },
    { name: 'unauthorized', path: '/unauthorized', component: Unauthorized }
];
