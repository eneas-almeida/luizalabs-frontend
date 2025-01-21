import { keyLocalStorage } from '@/configs/global.config';

const StorageHelper = {
    getToken() {
        const payload = localStorage.getItem(keyLocalStorage);

        return payload ? JSON.parse(payload).token : undefined;
    }
};

export { StorageHelper };
