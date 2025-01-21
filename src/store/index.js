import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import favorite from './modules/favorite';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isGlobalLoading: false,
        isMenuVisible: false
    },
    getters: {
        getDataIsGlobalLoading(state) {
            return state.isGlobalLoading;
        },
        getDataIsMenuVisible(state) {
            return state.isMenuVisible;
        }
    },
    mutations: {
        setGlobalLoading(state, status) {
            state.isGlobalLoading = status;
        },
        toggleMenu(state, isVisible) {
            if (!state.user) {
                state.isMenuVisible = false;
                return;
            }

            if (!isVisible) {
                state.isMenuVisible = !state.isMenuVisible;
            } else {
                state.isMenuVisible = isVisible;
            }
        },
        activeMenu(state) {
            state.isMenuVisible = true;
        }
    },
    modules: {
        app,
        user,
        favorite
    }
});
