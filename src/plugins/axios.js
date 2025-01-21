import axios from 'axios';
import { getServices } from '@/services';
import { baseApiUrl, serviceTimeout } from '@/configs/global.config';
import { StorageHelper } from '@/helpers/storage.helper';

let installed = false;

export default {
    install: (Vue) => {
        if (installed) return;

        installed = true;

        const watch = new Vue({
            data() {
                return {
                    ready: false,
                    http: null
                };
            }
        });

        Promise.resolve()
            .then(() => {
                init(watch);

                Object.defineProperty(Vue.prototype, '$service', {
                    get() {
                        return watch;
                    }
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

function init(watch) {
    const http = axios.create({
        baseURL: baseApiUrl,
        timeout: serviceTimeout
    });

    http.interceptors.request.use(
        (config) => {
            const token = StorageHelper.getToken();

            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            } else {
                delete config.headers.common['Authorization'];
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    http.interceptors.response.use(
        ({ data, headers }) => {
            return {
                data,
                headers
            };
        },
        (error) => {
            if (error.response && error.response.status === 403) {
                window.location.href = 'signin';
            }

            return Promise.reject(error);
        }
    );

    watch.http = getServices(http);
}
