<template>
    <div
        :title="getConfig('title')"
        v-show="activated"
        class="close-field"
        @click="closeField()">
        <v-icon small>{{ getConfig('icon') }}</v-icon>
    </div>
</template>

<script>
    import configs from '../configs/geral.config';

    export default {
        name: 'CloseIconField',
        props: {
            name: {
                type: String
            },
            activated: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            closeField() {
                this.$emit('closeSpeficField', this.name);
            }
        },
        computed: {
            getConfig() {
                return (config) => {
                    if (config === 'title') {
                        return configs.field.clearField.LABEL;
                    }

                    if (config === 'icon') {
                        return configs.field.clearField.ICON;
                    }

                    return null;
                };
            }
        }
    };
</script>
