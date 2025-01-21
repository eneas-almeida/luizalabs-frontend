<template>
    <v-btn
        :title="title"
        :disabled="disabled"
        :class="classCSS"
        color="primary"
        elevation="2"
        rounded
        x-large
        dense
        text
        @click="goTo()">
        <v-icon left>{{ icon }}</v-icon>
        <span>{{ title }}</span>
    </v-btn>
</template>

<script>
    export default {
        name: 'GoToButton',
        props: {
            icon: {
                type: String
            },
            title: {
                type: String
            },
            route: {
                type: String,
                default: 'home'
            },
            classCSS: {
                type: String,
                default: 'btn-go-to'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            goTo() {
                if (this.route) {
                    this.$router.push({ name: this.route });
                }
            }
        }
    };
</script>

<style></style>
