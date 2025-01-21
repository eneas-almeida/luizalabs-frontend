export default {
    state: {
        app: {
            name: 'ki',
            icon: null,
            createdAt: null
        }
    },
    getters: {
        getDataApp() {
            return this.app;
        }
    },
    mutations: {
        setDataApp(state, payload) {
            state.app = payload;
        }
    },
    actions: {
        setDataApp(context, payload) {
            context.commit('setDataApp', payload);
        }
    }
};
