<template>
    <v-snackbar :value="activated" top center :color="successComputed" class="snack">
        <span>{{ message }}</span>
        <v-btn color="#fff" text icon @click="closeSnack()">
            <v-icon>close</v-icon>
        </v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        data() {
            return {
                name: 'SnackBar'
            };
        },
        props: {
            activated: {
                type: Boolean,
                default: false
            },
            success: {
                type: Boolean,
                default: false
            },
            message: {
                type: String,
                default: 'Error genérico!'
            }
        },
        computed: {
            successComputed() {
                return this.success ? '#18a518' : '#d31616';
            }
        },
        methods: {
            closeSnack() {
                this.$emit('closeSnackBar');
            }
        }
    };
</script>

<style>
    .snack {
        position: fixed;
    }
</style>
