<template>
    <div class="sector">
        <SanackBar
            :activated="snackActivated"
            :success="snackSuccess"
            :message="snackMessage"
            @closeSnackBar="closeSnack()" />

        <div class="sector-head">
            <h1 class="sector-head-title">Produtos</h1>
        </div>

        <v-alert
            text
            dense
            color="gray"
            icon="mdi-alert-circle-outline"
            border="left"
            v-if="!products.length">
            Não existem produtos!
        </v-alert>

        <div class="box-table" v-else>
            <v-data-table
                :headers="headers"
                :items="products"
                :page.sync="pagination.page"
                :items-per-page="pagination.itemsPerPage"
                hide-default-footer
                class="data-table elevation-2"
                @page-count="pagination.pageCount = $event">
                <template v-slot:[`item.image`]="{ item }">
                    <div class="box-name">
                        <v-img
                            :src="item.image"
                            alt="Imagem"
                            style="height: 100px; width: 100px" />
                    </div>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div v-if="action && item.id === itemIdAllowed" class="confirm">
                        <div>Confirma?</div>

                        <div>
                            <v-btn
                                color="secondary"
                                class="btn-action option confirm-ok"
                                x-small
                                elevation="0"
                                rounded
                                dark
                                @click="actionConfirmAddFavorite(item.id, true)">
                                Sim
                            </v-btn>

                            <v-btn
                                color="red"
                                class="btn-action option"
                                x-small
                                elevation="0"
                                rounded
                                dark
                                @click="actionConfirmAddFavorite(item.id, false)">
                                Não
                            </v-btn>
                        </div>
                    </div>

                    <div v-else>
                        <v-progress-circular
                            :size="20"
                            color="gray"
                            v-show="item.stateActive"
                            indeterminate>
                        </v-progress-circular>

                        <v-btn
                            icon
                            title="Favoritar produto"
                            @click="actionAddFavorite(item.id)">
                            <v-icon>mdi-star</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table>
            <div class="text-center pt-2">
                <v-pagination
                    v-model="pagination.page"
                    :length="pagination.pageCount"></v-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import SanackBar from '@/components/snack/SanackBar.vue';

    export default {
        name: 'ListProducts',
        components: { SanackBar },
        data() {
            return {
                isAmbientLocalTests: false,
                snackActivated: false,
                snackSuccess: false,
                snackMessage: null,
                products: [],
                pagination: {
                    page: 1,
                    pageCount: 0,
                    itemsPerPage: 10
                },
                action: null,
                itemIdAllowed: null,
                headers: [
                    { text: 'Imagem', value: 'image', align: 'center' },
                    { text: 'Título', value: 'title' },
                    { text: 'Preço', value: 'price', align: 'center' },
                    { text: 'Ações', value: 'actions', align: 'center', sortable: false }
                ],
                productsInList: [],
                favoriteListId: null
            };
        },
        mounted() {
            this.getLastFavoriteList();
            this.serviceLoadingProducts();
        },
        computed: {
            ...mapGetters({
                user: 'getDataUser'
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
            actionAddFavorite(product) {
                this.action = true;
                this.itemIdAllowed = product;
            },
            findProductInList(productId) {
                return this.productsInList.find((e) => e.id === String(productId));
            },
            actionConfirmAddFavorite(productId, confirm) {
                if (confirm) {
                    if (!this.favoriteListId) {
                        this.activeSnack(
                            false,
                            'Não existe lista de favoritos cadastrada!'
                        );

                        this.itemIdAllowed = null;

                        return;
                    }

                    if (this.findProductInList(productId)) {
                        this.itemIdAllowed = null;

                        this.activeSnack(false, 'Produto já está na lista de favoritos!');

                        return;
                    }

                    if (this.productsInList.length >= 5) {
                        this.itemIdAllowed = null;

                        this.activeSnack(
                            false,
                            'Limite de 5 produtos na lista atingido!'
                        );

                        return;
                    }

                    this.efectiveActionAddFavorite(productId);
                }

                this.action = false;
                this.itemIdAllowed = null;
            },
            getLastFavoriteList() {
                this.$service.http['company']
                    .getFavoritesList()
                    .then((res) => {
                        if (res.data && res.data.data && res.data.data.length) {
                            this.favoriteListId = res.data.data[0].id;
                            this.productsInList = res.data.data[0].products;
                        }
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            },
            efectiveActionAddFavorite(productId) {
                this.$service.http['company']
                    .addProductFavorite(productId, this.favoriteListId)
                    .then((_) => {
                        this.productsInList.push({
                            id: productId
                        });

                        this.activeSnack(
                            true,
                            'Produto adicionado na lista de favoritos!'
                        );
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            },
            formatePrice(value) {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(value);
            },
            dataParse(data) {
                const products = [];

                data.forEach((e) => {
                    products.push({
                        id: e.id,
                        image: e.image,
                        title: e.title,
                        price: this.formatePrice(e.price)
                    });
                });

                return products;
            },
            serviceLoadingProducts() {
                this.$store.commit('setGlobalLoading', true);

                this.$service.http['company']
                    .getListProducts()
                    .then((result) => {
                        const { data } = result.data;

                        this.products = this.dataParse(data);

                        this.products.forEach((_, i) => {
                            this.products[i].index = i + 1;

                            this.$set(this.products[i], 'stateActive', false);
                        });
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally((_) => {
                        this.$store.commit('setGlobalLoading', false);
                    });
            }
        }
    };
</script>

<style>
    .confirm-ok {
        margin-right: 10px;
    }

    .btn-number {
        font-size: 20px !important;
        font-weight: bold !important;
        letter-spacing: 0em;
        color: #000000 !important;
    }

    .btn-action {
        text-transform: none !important;
        font-weight: bold;
        width: 70px;
        letter-spacing: 0em;
        margin-right: 10px;
    }

    .option {
        width: 30px !important;
    }

    .box-name {
        margin: 10px;
        letter-spacing: -0.02em;
    }

    .btn-item {
        margin-top: 5px;
    }

    .btn-manager {
        text-transform: none !important;
        font-weight: bold;
        letter-spacing: 0em;
    }

    .form-field-plus {
        display: flex;
        position: fixed;
        align-items: center;
        right: 15px;
        bottom: 60px;
        z-index: 1000;
    }

    .field-plus-legend {
        font-size: 14px;
        color: #777777;
    }

    @keyframes slide1 {
        0%,
        100% {
            transform: translate(0, 0);
        }

        50% {
            transform: translate(10px, 0);
        }
    }

    .arrow1 {
        animation: slide1 1s ease-in-out infinite;
        margin-left: 10px;
        margin-right: 20px;
    }

    .sector-head {
        margin-bottom: 15px;
    }

    .v-data-table-header {
        background-color: #d0d0d0;
    }
</style>
