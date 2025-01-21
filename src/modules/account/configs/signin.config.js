import geral from './geral.config';

const configs = {
    geral: {
        ...geral
    },
    titles: {
        SECTOR: 'Login'
    },
    fields: {
        email: {
            LABEL: 'Email'
        },
        password: {
            LABEL: 'Senha',
            MIN_LENGTH: 6,
            icon: {
                TEXT: 'visibility_off',
                PASSWORD: 'visibility',
                get(isTypeFieldPassword) {
                    return isTypeFieldPassword ? this.PASSWORD : this.TEXT;
                }
            }
        }
    },
    buttons: {
        SUBMIT: 'Efetuar login'
    },
    messages: {
        email: {
            alerts: {
                MANDATORY_EMAIL: 'Email obrigatório!'
            },
            errors: {
                CHECK_EMAIL: 'Preencha o campo email!',
                EMAIL_VALID: 'Insira um email válido!'
            }
        },
        password: {
            alerts: {
                MANDATORY_PASSWORD: 'Senha obrigatória!',
                MIN_LENGTH_PASSWORD: (minLength) => {
                    return `Insira pelo menos ${minLength} caracteres!`;
                }
            },
            errors: {
                CHECK_PASSWORD: 'Preencha o campo senha!',
                PASSWORD_VALID: 'Insira uma senha válido!'
            }
        }
    }
};

export default configs;
