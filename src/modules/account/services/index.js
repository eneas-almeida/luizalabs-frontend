import { dataAdapter } from '../helpers/data.adapter.helper';

let http = null,
    dataAdapted = null;

export default {
    install: (httpService) => {
        http = httpService;
    },
    signIn: (data) => {
        dataAdapted = dataAdapter('signIn', data);
        return http.post('/accounts/login', dataAdapted);
    },
    signUp: (data) => {
        dataAdapted = dataAdapter('signUp', data);
        return http.post('/accounts/create', dataAdapted);
    }
};
