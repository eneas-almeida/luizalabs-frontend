export default {
    state: {
        user: {
            id: null,
            name: null,
            email: null,
            role: null,
            token: null
        }
    },
    getters: {
        getDataUser(state) {
            return state.user;
        }
    },
    mutations: {
        setDataUser(state, payload) {
            state.user = payload;
        }
    },
    actions: {
        setDataUser(context, payload) {
            context.commit('setDataUser', payload);
        }
    }
};
