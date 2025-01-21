<template>
    <v-container class="sector">
        <v-layout justify-center align-center>
            <v-flex xs12>
                <!-- No dash -->
                <v-container class="no-items" v-if="!dashs.length && showNoItems">
                    <v-row>
                        <v-col style="background-color: #f0f0f0">
                            <v-btn
                                variant="outlined"
                                color="secondary"
                                x-large
                                @click="actionCreate()">
                                Adicionar lista
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-container>

                <!-- Dashs -->
                <v-container class="dashs" v-else>
                    <v-row>
                        <v-col
                            v-for="(dash, index) of dashs"
                            :key="dash.sector"
                            class="dash-panel"
                            :class="firstItemComputed(index)">
                            <div class="dash-item">
                                <div class="icon">
                                    <v-icon x-large color="black">{{ dash.icon }}</v-icon>
                                </div>
                                <div class="title">{{ dash.title }}</div>

                                <div class="count">{{ dash.products.length }}</div>

                                <div class="box-favorites">
                                    <div class="box-list-items">
                                        <div
                                            v-for="product of dash.products"
                                            :key="product.id"
                                            class="item">
                                            <div
                                                class="item-del"
                                                @click="
                                                    deleteProductInFavoriteList(
                                                        product.id,
                                                        dash.id
                                                    )
                                                ">
                                                x
                                            </div>
                                            <v-img
                                                :src="product.image"
                                                width="50"
                                                height="50"></v-img>
                                        </div>
                                    </div>

                                    <div class="box-list-fakeitems">
                                        <div v-for="i in 5" :key="i" class="item"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="options">
                                <v-btn
                                    @click="deleteFavoriteList(dash.id)"
                                    small
                                    class="v-item-btn">
                                    <v-icon left>mdi-delete</v-icon>
                                    <span class="lowercase">Excluir</span>
                                </v-btn>

                                <v-btn
                                    @click="actionEdit(dash.id)"
                                    small
                                    class="v-item-btn">
                                    <v-icon left>mdi-pencil</v-icon>
                                    <span class="lowercase">Editar</span>
                                </v-btn>
                            </div>
                        </v-col>
                    </v-row>
                </v-container>

                <!-- Add/Edit -->
                <v-container class="panel-add-edit" v-if="showAddEedit">
                    <v-row>
                        <v-col style="background-color: #f0f0f0"> add/edit </v-col>
                    </v-row>
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        name: 'DashCompany',
        data() {
            return {
                showDashs: false,
                showNoItems: true,
                showAddEedit: false,
                dialog: false,
                dashs: []
            };
        },
        mounted() {
            this.populatePanel();
        },
        computed: {
            ...mapGetters({
                user: 'getDataUser'
            }),
            firstItemComputed() {
                return (index) => {
                    return {
                        'dash-item-first': !index ? true : false
                    };
                };
            }
        },
        methods: {
            goTo(path) {
                if (this.user) {
                    return this.$router.push({ path });
                }

                return this.$router.push({ name: 'signin' });
            },
            addOreditList() {
                this.showDashs = false;
                this.showAddEedit = true;
                this.showNoItems = false;
            },
            actionCreate() {
                this.$store.dispatch('setFavoriteEditionMode', false);
                this.$store.dispatch('setFavoriteId', null);
                this.$router.push({ name: 'favoriteFormCompany' });
            },
            actionEdit(favoriteId) {
                this.$store.dispatch('setFavoriteEditionMode', true);
                this.$store.dispatch('setFavoriteId', favoriteId);
                this.$router.push({ name: 'favoriteFormCompany' });
            },
            dataAdapter(data) {
                return data.map((dash) => {
                    const { title, products } = dash;

                    return {
                        id: dash.id,
                        sector: title,
                        title,
                        count: products.length,
                        icon: 'mdi-gift',
                        products
                    };
                });
            },
            deleteFavoriteList(id) {
                this.$store.commit('setGlobalLoading', true);

                this.$service.http['company']
                    .deleteFavoriteList(id)
                    .then((_) => {
                        this.dashs = [];
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally((_) => {
                        this.showDashs = true;
                        this.$store.commit('setGlobalLoading', false);
                    });
            },
            deleteProductInFavoriteList(productId, favoriteListId) {
                this.$service.http['company']
                    .deleteProduct(productId, favoriteListId)
                    .then((_) => {
                        const dash = this.dashs.find(
                            (dash) => dash.id === favoriteListId
                        );

                        dash.products = dash.products.filter(
                            (product) => product.id !== productId
                        );
                    })
                    .catch((e) => {
                        console.error(e);
                    });
            },
            populatePanel() {
                this.$store.commit('setGlobalLoading', true);

                this.$service.http['company']
                    .getListFavorites()
                    .then((result) => {
                        const { data } = result.data;

                        const dataAdpted = this.dataAdapter(data);

                        this.dashs = dataAdpted;
                    })
                    .catch((e) => {
                        console.error(e);
                    })
                    .finally((_) => {
                        this.showDashs = true;
                        this.$store.commit('setGlobalLoading', false);
                    });
            }
        }
    };
</script>

<style scoped>
    .sector {
        width: 100%;
    }

    .sector-flex {
        width: 100%;
    }

    .sector .sector-head-slug {
        margin-bottom: 30px;
        text-align: center;
    }

    .dashs .dash-item {
        position: relative;
        margin: 15px;
        height: 205px;
        background-color: #fff;
    }

    .options {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: left;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        background-color: #f0f0f0;
        -webkit-border-bottom-right-radius: 7px;
        -webkit-border-bottom-left-radius: 7px;
        -moz-border-radius-bottomright: 7px;
        -moz-border-radius-bottomleft: 7px;
        border-bottom-right-radius: 7px;
        border-bottom-left-radius: 7px;
    }

    .options .v-item-btn {
        margin-left: 10px;
    }

    .dash-panel {
        position: relative;
        padding: 0;
        margin: 0;
        background-color: #ffffff;
        border-radius: 7px;
    }

    .dashs .dash-item .count {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 50px;
    }

    .dashs .dash-item .title {
        position: absolute;
        font-size: 20px !important;
        font-weight: 500 !important;
        color: #000;
        left: 0px;
        top: 60px;
    }

    .dashs .dash-item .slug {
        position: absolute;
        font-size: 16px !important;
        font-weight: normal !important;
        color: #000;
        right: 20px;
        top: 70px;
    }

    .dashs .dash-item .box-favorites {
        position: relative;
        display: flex;
        padding-top: 10px;
        top: 55px;
        border-top: 1px solid #e0e0e0;
    }

    .dashs .dash-item .box-favorites .box-list-items {
        position: absolute;
        display: flex;
        z-index: 2;
    }

    .dashs .dash-item .box-favorites .box-list-items .item {
        position: relative;
        margin-right: 15px;
        width: 50px;
        height: 50px;
        border-radius: 7px;
    }

    .dashs .dash-item .box-favorites .box-list-items .item img {
        position: relative;
        z-index: 1;
        display: block;
        width: 50px;
        height: 50px;
        border-radius: 7px;
    }

    .dashs .dash-item .box-favorites .box-list-items .item .item-del {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 50%;
        color: #000;
        font-size: 14px;
        font-weight: bold;
        bottom: -10px;
        right: -10px;
        cursor: pointer;
        z-index: 2;
    }

    .dashs .dash-item .box-favorites .box-list-fakeitems {
        position: absolute;
        display: flex;
        z-index: 1;
    }

    .dashs .dash-item .box-favorites .box-list-fakeitems .item {
        margin-right: 15px;
        width: 50px;
        height: 50px;
        background-color: #f0f0f0;
        border-radius: 7px;
    }

    .lowercase {
        text-transform: none;
    }
</style>
