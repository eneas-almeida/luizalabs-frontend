<template>
    <header class="header">
        <a
            class="toggle"
            @click="toggleMenu"
            v-if="!hideToggle && user.role !== 'USER'"
            :title="titleIcon">
            <em class="fa fa-lg" :class="icon"></em>
        </a>
        <div class="title">
            <img src="@/assets/images/luizalabs-logo.png" alt="Luizalabs" />
        </div>
        <UserDropdown v-if="!hideUserDropdown" />
    </header>
</template>

<script>
    import { mapGetters } from 'vuex';
    import UserDropdown from './UserDropdown';

    export default {
        name: 'Header',
        components: { UserDropdown },
        props: {
            hideToggle: Boolean,
            nameApp: String,
            hideUserDropdown: Boolean
        },
        computed: {
            ...mapGetters({
                user: 'getDataUser'
            }),
            isMenuVisible() {
                return this.$store.state.isMenuVisible;
            },
            icon() {
                return this.isMenuVisible ? 'fa-angle-left' : 'fa-angle-down';
            },
            titleIcon() {
                return this.isMenuVisible ? 'Fechar menu' : 'Abrir menu';
            }
        },
        methods: {
            goTo() {
                const map = {
                    COMPANY: 'dash_company'
                };

                const role = this.user.role;

                const exists = map.hasOwnProperty(role);

                exists && this.$router.push({ path: map[role] });
            },
            toggleMenu() {
                this.$store.commit('toggleMenu');
            }
        }
    };
</script>

<style>
    .header {
        grid-area: header;
        background: rgb(105, 0, 154);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        font-size: 1.2rem;
        color: #fff;
        font-weight: 100;
        flex-grow: 1;
        text-align: center;
    }

    .title img {
        display: block;
        width: 140px;
        margin: auto;
    }

    .title a {
        color: #fff !important;
        text-decoration: none;
    }

    .title a:hover {
        color: #fff;
        text-decoration: none;
    }

    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: #fff;
        justify-self: flex-start;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    header.header > a.toggle:hover {
        color: #fff;
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>
