let http = null;

// Produtos
const products = {
    getListProducts: () => {
        return http.get(`/products`);
    },
    addProductFavorite: (productId, favoriteId) => {
        const params = {
            option: 'add',
            productId,
            favoriteId
        };

        return http.patch('/favorites/manager', null, { params });
    }
};

// Lista de favoritos
const favorites = {
    deleteProduct: (productId, favoriteId) => {
        const params = {
            option: 'sub',
            productId,
            favoriteId
        };

        return http.patch(`/favorites/manager`, null, { params });
    },
    deleteFavoriteList: (id) => {
        return http.delete(`/favorites/${id}`);
    },
    getListFavorites: () => {
        return http.get(`/favorites`);
    },
    getFavoritesList: () => {
        return http.get(`/favorites`);
    },
    getFavoriteById: (favoriteId) => {
        return http.get(`/favorites/${favoriteId}`);
    },
    createFavoriteList: (data) => {
        return http.post(`/favorites`, data);
    },
    updateFavoriteList: (favoriteId, data) => {
        return http.put(`/favorites/${favoriteId}`, data);
    }
};

export default {
    install: (httpService) => {
        http = httpService;
    },
    ...products,
    ...favorites
};
