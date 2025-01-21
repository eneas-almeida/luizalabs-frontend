import geral from './geral.config';

const configs = {
    geral: {
        ...geral
    },
    titles: {
        SECTOR: 'Criar nova conta'
    },
    fields: {
        name: {
            LABEL: 'Nome',
            MIN_LENGTH: 3,
            icon: {
                COMPANY: 'face',
                get(role) {
                    return this[role];
                }
            }
        },
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
        },
        confirmPassword: {
            LABEL: 'Repita a senha'
        },
        acceptTerms: {
            LABEL: 'Aceitar os termos de uso'
        }
    },
    buttons: {
        SUBMIT: 'Criar conta'
    },
    messages: {
        name: {
            alerts: {
                MANDATORY_NAME: 'Nome é obrigatório!',
                CHECK_NAME: 'Preencha o campo nome!'
            },
            errors: {
                NAME_VALID: 'Insira um nome válido!',
                CHECK_NAME: 'Digite seu nome!'
            }
        },
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
        },
        confirmPassword: {
            alerts: {
                MANDATORY_CONFIRM_PASSWORD: 'Confirmação obrigatória!'
            },
            errors: {
                CHECK_CONFIRM_PASSWORD: 'Preencha o campo repetir senha!',
                CONFIRM_PASSWORD_VALID: 'Insira a repetição de senha!'
            }
        },
        passwordEquals: {
            errors: {
                PASSWORD_EQUALS: 'A senha e a confirmação não são iguais!!'
            }
        },
        checkTerms: {
            errors: {
                CHECK_CONFIRM_PASSWORD: 'Preencha o campo aceitar termos de uso!'
            }
        }
    }
};

export default configs;
