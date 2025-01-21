<template>
    <div class="user-dropdown">
        <div class="user-button">
            <em class="fa fa-gear"></em>
        </div>
        <div class="user-dropdown-content">
            <a href @click.prevent="logout" class="item-menu">
                <em class="fa fa-sign-out"></em> <span>Sair</span>
            </a>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { keyLocalStorage } from '@/configs/global.config';

    export default {
        name: 'UserDropdown',
        computed: mapGetters({
            user: 'getDataUser'
        }),
        methods: {
            logout() {
                localStorage.removeItem(keyLocalStorage);

                this.$store.dispatch('setDataUser', null);

                this.$router.push({ name: 'signin' });
            }
        }
    };
</script>

<style>
    .user-dropdown {
        position: relative;
        height: 100%;
        cursor: pointer;
        font-size: 16px;
    }

    .user-button {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0px 20px;
    }

    .user-dropdown:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .user-dropdown-img {
        margin: 0px 10px;
    }

    .user-dropdown-img > img {
        max-height: 37px;
        border-radius: 5px;
    }

    .user-dropdown-content {
        position: absolute;
        right: 0px;
        background-color: #f9f9f9;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        padding: 10px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s linear;
    }

    .user-dropdown:hover .user-dropdown-content {
        visibility: visible;
        opacity: 1;
    }

    .user-dropdown-content a {
        text-decoration: none;
        color: #000;
        padding: 10px;
        font-size: 14px;
    }

    .user-dropdown-content a:hover {
        text-decoration: none;
        color: #000;
        background-color: #ededed;
    }

    .user-dropdown-content .item-menu .fa {
        margin-right: 5px;
    }
</style>
