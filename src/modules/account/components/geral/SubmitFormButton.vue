<template>
    <v-btn
        :title="title"
        :disabled="disabled"
        :class="classStyle"
        color="secondary"
        block
        rounded
        x-large
        @click="submitEmit()">
        <span>{{ title }}</span>
    </v-btn>
</template>

<script>
    export default {
        name: 'SubmitFormButton',
        props: {
            title: {
                type: String
            },
            classStyle: {
                type: String,
                default: 'btn-submit-form'
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            submitEmit() {
                this.$emit('submitForm');
            }
        }
    };
</script>

<style></style>
