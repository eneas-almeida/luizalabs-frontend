<template>
    <div class="geral" :class="style">
        <div v-show="loading" class="loading">
            <img src="@/assets/images/loading.gif" alt="Loading" />
            <div>Carregando...</div>
        </div>
        <router-view v-show="!loading"></router-view>
    </div>
</template>

<script>
    export default {
        name: 'Content',
        computed: {
            loading() {
                return this.$store.state.isGlobalLoading;
            },
            style() {
                return {
                    'geral-content': !this.loading
                };
            }
        }
    };
</script>

<style>
    .geral {
        grid-area: content;
        display: flex;
        padding: 20px;
        justify-content: center;
    }

    .geral .loading {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .geral-content {
        background-color: #e0e0e0;
    }
</style>
