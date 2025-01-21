import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';
import pt from 'vuetify/lib/locale/pt';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        locales: { pt },
        current: 'pt'
    },
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: colors.purple.darken3,
                secondary: colors.green.accent4,
                accent: colors.indigo.darken3,
                info: colors.blue,
                error: colors.purple.darken3,
                success: colors.teal.lighten1,
                warking: colors.purple.darken3
            }
        }
    }
});
