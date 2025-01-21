import account from '@/modules/account/services';
import company from '@/modules/company/services';

export function getServices(httpService) {
    account.install(httpService);
    company.install(httpService);

    return {
        account,
        company
    };
}
