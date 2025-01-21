const Signin = () => import('../views/Signin.vue');
const Signup = () => import('../views/Signup.vue');

export default [
    { name: 'signin', path: '/signin', component: Signin },
    { name: 'signup', path: '/signup', component: Signup }
];
