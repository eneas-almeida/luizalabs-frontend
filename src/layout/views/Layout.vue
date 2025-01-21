<template>
    <v-app>
        <div class="app" :class="{ 'hide-menu': hideMenuComputed }">
            <Header
                :hideToggle="hideToggleComputed"
                :nameApp="app.name"
                :hideUserDropdown="!user" />
            <Menu v-if="showMenuComputed" />
            <Content v-if="isLoading" />
            <Footer :nameApp="app.name" />
        </div>
    </v-app>
</template>

<script>
    import axios from 'axios';
    import { mapGetters } from 'vuex';
    import { keyLocalStorage, baseApiUrl } from '@/configs/global.config';
    import Header from '../components/Header';
    import Menu from '../components/Menu';
    import Content from '../components/Content';
    import Footer from '../components/Footer';
    import { dataUserAdapter } from '@/modules/account/helpers/data.user.adapter.helper';

    export default {
        name: 'Layout',
        components: { Header, Menu, Content, Footer },
        data() {
            return {
                isLoading: false,
                app: null
            };
        },
        async created() {
            this.appLoading();

            await this.validateToken();

            this.$store.commit('activeMenu');
        },
        computed: {
            ...mapGetters({
                user: 'getDataUser',
                isMenuVisible: 'getDataIsMenuVisible'
            }),
            hideToggleComputed() {
                return !this.user;
            },
            showMenuComputed() {
                return this.user && this.user.role !== 'USER' && this.isMenuVisible;
            },
            hideMenuComputed() {
                return (
                    !this.user ||
                    (this.user && this.user.role === 'USER') ||
                    !this.isMenuVisible
                );
            }
        },
        methods: {
            appLoading() {
                const mockDataApp = {
                    name: 'Luizalabs',
                    icon: 'luizalabs.ico',
                    createdAt: '2025'
                };

                this.app = mockDataApp;

                this.$store.dispatch('setDataApp', mockDataApp);
            },
            goTo(role) {
                const map = {
                    ADMIN: 'dash_admin',
                    USER: 'queue',
                    MANAGER: 'campaigns_manager',
                    COMPANY: 'dash_company'
                };

                const exists = map.hasOwnProperty(role);

                exists && this.$router.push({ path: map[role] });
            },
            async validateToken() {
                this.isLoading = false;

                const jsonLocalStorage = localStorage.getItem(keyLocalStorage);

                const currentUser = JSON.parse(jsonLocalStorage);

                this.$store.dispatch('setDataUser', null);

                if (!currentUser || (currentUser && !currentUser.token)) {
                    this.isLoading = true;

                    return this.$router.push({ name: 'signin' });
                }

                await axios
                    .get(`${baseApiUrl}/userToken/${currentUser.token}`)
                    .then((result) => {
                        if (result.data) {
                            this.$store.dispatch(
                                'setDataUser',
                                dataUserAdapter(currentUser)
                            );

                            this.isLoading = true;

                            const userRole = currentUser.role;

                            this.goTo(userRole);
                        } else {
                            localStorage.removeItem(keyLocalStorage);

                            this.$router.push({ name: 'signin' });
                        }
                    })
                    .catch((_) => {
                        localStorage.removeItem(keyLocalStorage);

                        console.error('expirou!!!!');

                        this.isLoading = false;

                        return this.$router.push({ name: 'signin' });
                    })
                    .finally((_) => {
                        this.isLoading = true;
                    });
            }
        }
    };
</script>

<style>
    * {
        font-family: 'Lato', sans-serif;
    }

    body {
        margin: 0;
    }

    .app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        height: 100vh;
        display: grid;
        grid-template-rows: 60px 1fr 40px;
        grid-template-columns: auto 1fr;
        grid-template-areas:
            'header header'
            'menu content'
            'menu footer';
    }

    .app.hide-menu {
        grid-template-areas:
            'header header'
            'content content'
            'footer footer';
    }
</style>
