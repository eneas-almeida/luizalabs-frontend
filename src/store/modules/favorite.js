export default {
    state: {
        favorite: {
            id: null,
            isEditionMode: false
        }
    },
    getters: {
        getDataFavorite(state) {
            return state.favorite;
        }
    },
    mutations: {
        setDataFavorite(state, payload) {
            state.favorite = payload;
        },
        setFavoriteId(state, payload) {
            state.favorite.id = payload;
        },
        setFavoriteEditionMode(state, payload) {
            state.favorite.isEditionMode = payload;
        }
    },
    actions: {
        setDataFavorite(context, payload) {
            context.commit('setDataFavorite', payload);
        },
        setFavoriteId(context, payload) {
            context.commit('setFavoriteId', payload);
        },
        setFavoriteEditionMode(context, payload) {
            context.commit('setFavoriteEditionMode', payload);
        }
    }
};
