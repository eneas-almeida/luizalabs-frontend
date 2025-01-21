<template>
    <div class="sector">
        <SanackBar
            :activated="snackActivated"
            :success="snackSuccess"
            :message="snackMessage"
            @closeSnackBar="closeSnack()" />

        <div class="form">
            <div class="form-head">
                <h1 class="head-title">{{ titles.sector }}</h1>
            </div>

            <div class="form-fields">
                <div class="field-box field-name">
                    <label>Título</label>

                    <v-text-field
                        v-model="favorite.title"
                        ref="title"
                        type="title"
                        filled
                        rounded
                        dense>
                    </v-text-field>
                </div>

                <div class="field-box">
                    <label>Descrição</label>

                    <v-textarea
                        v-model="favorite.description"
                        row-height="30"
                        rows="4"
                        filled
                        rounded
                        dense></v-textarea>
                </div>

                <div class="field-box field-submit">
                    <SubmitFormButton
                        :title="titles.submitButton"
                        :disabled="formSubmited"
                        @submitForm="submitForm()" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SanackBar from '@/components/snack/SanackBar.vue';
    import SubmitFormButton from '@/components/SubmitFormButton.vue';

    export default {
        name: 'FormFavorite',
        components: { SanackBar, SubmitFormButton },
        data() {
            return {
                isEditionMode: false,
                snackActivated: false,
                snackSuccess: false,
                snackMessage: null,
                formSubmited: false,
                favorite: {
                    title: null,
                    description: null
                },
                titles: {
                    sector: null,
                    submitButton: null
                }
            };
        },
        async mounted() {
            await this.checkIsEditionMode();
        },
        computed: {
            ...mapGetters({
                userStore: 'getDataUser',
                favoriteStore: 'getDataFavorite'
            })
        },
        methods: {
            activeSnack(success, message) {
                this.snackActivated = true;
                this.snackSuccess = success;
                this.snackMessage = message;
            },
            closeSnack() {
                this.snackActivated = false;
            },
            goTo() {
                return this.$router.push({ name: 'groupFormCompany' });
            },
            async checkIsEditionMode() {
                if (this.favoriteStore.isEditionMode) {
                    this.titles.sector = 'Editar lista';
                    this.titles.submitButton = 'Atualizar';
                    this.isEditionMode = true;

                    await this.serviceLoadingFavorite();
                } else {
                    this.titles.sector = 'Criar lista';
                    this.titles.submitButton = 'Criar';
                }
            },
            goToAfterSubmitForm() {
                this.$router.push({ name: 'dashCompany' });
            },
            dataParse(data) {
                const { title, description } = data;

                return { title, description };
            },
            validateSubmitForm() {
                const snack = (message) => this.activeSnack(false, message);

                const validateFavoriteTitle = (value) => {
                    if (!value) {
                        snack('Preencha o campo título!');
                        return true;
                    }

                    if (value.length < 5) {
                        snack('O título deve conter no mínimo 5 caracteres!');
                        return true;
                    }

                    if (value.length > 30) {
                        snack('O título deve conter até 30 caracteres!');
                        return true;
                    }

                    return false;
                };

                const validateFavoriteDescription = (value) => {
                    if (!value) {
                        snack('Preencha o campo descrição!');
                        return true;
                    }

                    if (value.length < 6) {
                        snack('A descrição deve conter no mínimo 6 caracteres!');
                        return true;
                    }

                    if (value.length > 128) {
                        snack('A descrição deve conter até 128 caracteres!');
                        return true;
                    }

                    return false;
                };

                const errors = [
                    validateFavoriteDescription(this.favorite.description),
                    validateFavoriteTitle(this.favorite.title)
                ];

                return !errors.some((e) => e);
            },
            buildFavorite(data) {
                Object.keys(this.favorite).forEach((key) => {
                    this.favorite[key] = data[key];
                });
            },
            async serviceLoadingFavorite() {
                this.$store.commit('setGlobalLoading', true);

                const favoriteId = this.favoriteStore.id;

                await this.$service.http['company']
                    .getFavoriteById(favoriteId)
                    .then((result) => {
                        const { data } = result.data;

                        this.buildFavorite(data);
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally((_) => {
                        this.$store.commit('setGlobalLoading', false);
                    });
            },
            async serviceUpdateFavorite() {
                const dataParsed = this.dataParse(this.favorite);

                const favoriteId = this.favoriteStore.id;

                await this.$service.http['company']
                    .updateFavoriteList(favoriteId, dataParsed)
                    .then((_) => {
                        this.activeSnack(true, 'Lista atualizada!');

                        setTimeout(() => {
                            this.goToAfterSubmitForm();
                        }, 2000);
                    })
                    .catch((e) => {
                        console.error(e);

                        this.activeSnack(
                            false,
                            'Ocorreu um erro no processamento do endpoint!'
                        );
                    })
                    .finally((_) => {
                        this.formSubmited = false;

                        this.$store.commit('setGlobalLoading', false);
                    });
            },
            async serviceCreateFavorite() {
                const dataParsed = this.dataParse(this.favorite);

                await this.$service.http['company']
                    .createFavoriteList(dataParsed)
                    .then((_) => {
                        this.activeSnack(true, 'Lista de favoritos criada!');

                        setTimeout(() => {
                            this.goToAfterSubmitForm();
                        }, 2000);
                    })
                    .catch((e) => {
                        console.error(e);

                        this.activeSnack(
                            false,
                            'Ocorreu um erro no processamento do endpoint!'
                        );
                    })
                    .finally((_) => {
                        this.formSubmited = false;

                        this.$store.commit('setGlobalLoading', false);
                    });
            },
            async submitForm() {
                if (!this.validateSubmitForm()) return;

                this.$store.commit('setGlobalLoading', true);

                this.formSubmited = true;

                if (this.favoriteStore.isEditionMode) {
                    await this.serviceUpdateFavorite();
                } else {
                    await this.serviceCreateFavorite();
                }

                this.formSubmited = false;

                this.$store.commit('setGlobalLoading', false);
            }
        }
    };
</script>

<style scoped>
    .sector {
        width: 350px;
    }

    .sector-head-title {
        font-size: 26px;
    }

    .field-name {
        margin-top: 20px;
    }

    .field-submit {
        margin-top: 10px;
    }

    .field-date-hour {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .field-date-hour .field-date,
    .field-date-hour .field-hour {
        width: 48%;
    }
</style>
