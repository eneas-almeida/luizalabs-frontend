const DashCompany = () => import('../views/DashCompany.vue');
const ListProducts = () => import('../views/products/ListProducts.vue');
const FormFavorite = () => import('../views/favorites/FormFavorite.vue');

export default [
    {
        name: 'favoriteFormCompany',
        path: '/favorite_form_company',
        component: FormFavorite,
        meta: { authorized: ['COMPANY'] }
    },
    {
        name: 'dashCompany',
        path: '/dash_company',
        component: DashCompany,
        meta: { authorized: ['COMPANY'] }
    },
    {
        name: 'productsCompany',
        path: '/products_company',
        component: ListProducts,
        meta: { authorized: ['COMPANY'] }
    }
];
