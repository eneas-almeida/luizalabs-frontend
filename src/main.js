import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import '@/plugins/mq';
import vuelidate from '@/plugins/vuelidate';
import axios from '@/plugins/axios';

Vue.config.productionTip = false;

Vue.use(axios);

new Vue({
    router,
    store,
    vuetify,
    vuelidate,
    render: (h) => h(App)
}).$mount('#app');
