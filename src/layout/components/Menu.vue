<template>
    <aside class="menu" v-show="isMenuVisible">
        <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
            <v-list-item class="px-2">
                <v-list-item-avatar>
                    <v-icon color="gray" @click="toggleIconMenu()">{{ iconMenu }}</v-icon>
                </v-list-item-avatar>
                <v-list-item-title class="user-name"></v-list-item-title>
                <v-btn icon @click.stop="toggleIconMenu()">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
            </v-list-item>

            <v-divider></v-divider>

            <v-list dense class="list-itens">
                <v-list-item
                    v-for="item in menu"
                    :key="item.title"
                    link
                    :to="goTo(item.path)">
                    <v-list-item-icon>
                        <v-icon size="22">{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </aside>
</template>

<script>
    import { mapState, mapGetters } from 'vuex';
    import configs from '../configs/layout.config';

    export default {
        name: 'Menu',
        data() {
            return {
                drawer: true,
                menu: [],
                mini: true,
                iconMenu: 'mdi-menu'
            };
        },
        mounted() {
            this.loadMenu();
        },
        computed: {
            ...mapState(['isMenuVisible']),
            ...mapGetters({
                user: 'getDataUser'
            })
        },
        methods: {
            goTo(path) {
                if (!this.user) {
                    return 'signin';
                }

                return path;
            },
            loadMenu() {
                const { company } = configs.menus;

                const map = {
                    company
                };

                const userRole = this.user.role.toLowerCase();

                const exists = map.hasOwnProperty(userRole);

                if (exists) {
                    this.menu = map[userRole];
                }
            },
            getInfo() {
                const userRole = this.user.role.toLowerCase();

                return {
                    icon: configs.info[userRole].icon,
                    title: configs.info[userRole].title
                };
            },
            toggleIconMenu() {
                this.mini = !this.mini;

                this.iconMenu =
                    this.iconMenu === 'mdi-menu' ? 'mdi-playlist-check' : 'mdi-menu';
            }
        }
    };
</script>

<style>
    .menu {
        grid-area: menu;
        background-color: #d0d0d0;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .list-itens {
        margin-top: 0px !important;
        padding-top: 0px !important;
    }

    .v-avatar {
        margin-right: 8px !important;
    }

    .v-icon:before {
        cursor: pointer !important;
    }

    .user-name {
        font-size: 22px !important;
        font-weight: bold;
        color: #7b009c !important;
    }

    .v-list-item__icon {
        margin-right: 8px !important;
    }

    .v-list-item__title {
        font-size: 14px !important;
        letter-spacing: -0.02em;
        color: #656565;
    }
</style>
