<template>
    <v-container fill-height>
        <v-layout justify-center align-center>
            <v-flex xs12 sm6 md4 lg3 xl3>
                <SanackBar
                    :activated="snackActivated"
                    :success="snackSuccess"
                    :message="snackMessage"
                    @closeSnackBar="closeSnack()" />

                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>{{ titles.toolbar }}</v-toolbar-title>
                        <v-spacer></v-spacer>
                        <v-progress-circular
                            indeterminate
                            color="white"
                            width="2"
                            v-show="loadingActivated">
                        </v-progress-circular>
                    </v-toolbar>

                    <v-card-text>
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-container class="field">
                                            <CloseField
                                                :name="'email'"
                                                :activated="
                                                    getStatusFieldComputed('email')
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getLabel('email')"
                                                :disabled="loadingActivated"
                                                type="email"
                                                ref="email"
                                                :background-color="fields.email.bgColor"
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="$v.user.email.$model"
                                                :error-messages="emailErrorsComputed"
                                                :success="emailSuccessComputed"
                                                @select="activeField('email')"
                                                @focus="activeField('email')">
                                            </v-text-field>
                                        </v-container>

                                        <v-container class="field">
                                            <CloseField
                                                :name="'password'"
                                                :activated="
                                                    getStatusFieldComputed('password')
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getLabel('password')"
                                                :disabled="loadingActivated"
                                                name="password"
                                                ref="password"
                                                :background-color="
                                                    fields.password.bgColor
                                                "
                                                :append-icon="
                                                    getIconFieldComputed('password')
                                                "
                                                :type="getFieldTypePasswordComputed"
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="$v.user.password.$model"
                                                :error-messages="passwordErrorsComputed"
                                                :success="passwordSuccessComputed"
                                                @select="activeField('password')"
                                                @focus="activeField('password')"
                                                @click:append="
                                                    isTypeFieldPassword =
                                                        !isTypeFieldPassword
                                                ">
                                            </v-text-field>
                                        </v-container>

                                        <SubmitFormButton
                                            :title="titles.submitButton"
                                            :disabled="loadingActivated"
                                            @submitForm="submitForm()" />
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-container class="box">
                    <GoTo
                        :title="titles.goToSignUp"
                        :icon="'person_add'"
                        :route="'signup'"
                        :disabled="loadingActivated" />
                </v-container>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import { required, email, minLength } from 'vuelidate/lib/validators';
    import SanackBar from '@/components/snack/SanackBar.vue';
    import CloseField from '../components/geral/CloseIconField.vue';
    import geralConfig from '../configs/geral.config';
    import signinConfig from '../configs/signin.config';
    import { dataUserAdapter } from '@/modules/account/helpers/data.user.adapter.helper';
    import { keyLocalStorage, isAmbientGeralTests } from '@/configs/global.config';
    import userMock from '../mocks/signin.mock';
    import GoTo from '../components/geral/GoToButton.vue';
    import SubmitFormButton from '../components/geral/SubmitFormButton.vue';

    export default {
        name: 'Signin',
        components: { SanackBar, CloseField, GoTo, SubmitFormButton },
        data() {
            return {
                isAmbientLocalTests: true,
                loadingActivated: false,
                snackActivated: false,
                snackSuccess: false,
                snackMessage: null,
                fieldNameActivated: null,
                fieldSelected: null,
                isTypeFieldPassword: true,
                user: {
                    email: null,
                    password: null
                },
                titles: {
                    toolbar: signinConfig.titles.SECTOR,
                    goToSignUp: signinConfig.geral.buttons.SIGNUP,
                    goToForgotPassword: signinConfig.geral.buttons.FORGOT_PASSWORD,
                    submitButton: signinConfig.buttons.SUBMIT
                },
                configs: {
                    fields: {
                        bgColor: {
                            error: '#ffffcc'
                        }
                    }
                },
                fields: {
                    email: {
                        btClose: false,
                        bgColor: null
                    },
                    password: {
                        btClose: false,
                        bgColor: null
                    }
                }
            };
        },
        mounted() {
            this.populateGeral();

            this.activeField('email');

            this.changeColorField('email');

            this.focusField('email');

            this.checkStateFields();
        },
        watch: {
            user: {
                handler(e) {
                    this.monitoreUserFieldsComputed(e);
                },
                deep: true
            }
        },
        computed: {
            monitoreUserFieldsComputed() {
                return (e) => {
                    for (const key of Object.keys(this.fields)) {
                        if (e[key] && e[key].length) {
                            this.fields[key].btClose = true;
                        } else {
                            this.fields[key].btClose = false;
                        }
                    }
                };
            },
            getStatusFieldComputed() {
                return (nameField) => {
                    return this.fields[nameField].btClose;
                };
            },
            getIconFieldComputed() {
                return (nameField) => {
                    if (nameField === 'password') {
                        return signinConfig.fields.password.icon.get(
                            this.isTypeFieldPassword
                        );
                    }
                };
            },
            getFieldTypePasswordComputed() {
                return this.isTypeFieldPassword ? 'password' : 'text';
            },
            emailErrorsComputed() {
                const emailField = this.$v.user.email;

                if (!emailField.$dirty) {
                    return [];
                }

                const errors = [];

                !emailField.required &&
                    errors.push(signinConfig.messages.email.alerts.MANDATORY_EMAIL);

                !emailField.email &&
                    errors.push(signinConfig.messages.email.errors.EMAIL_VALID);

                return errors;
            },
            emailSuccessComputed() {
                const emailField = this.$v.user.email;

                this.toggleFieldBgColor('email', emailField);

                return !emailField.$invalid;
            },
            passwordErrorsComputed() {
                const passwordField = this.$v.user.password;

                if (!passwordField.$dirty) {
                    return [];
                }

                const errors = [];

                !passwordField.required &&
                    errors.push(signinConfig.messages.password.alerts.MANDATORY_PASSWORD);

                const minPasswordLength = signinConfig.fields.password.MIN_LENGTH;

                !passwordField.minLength &&
                    errors.push(
                        signinConfig.messages.password.alerts.MIN_LENGTH_PASSWORD(
                            minPasswordLength
                        )
                    );

                return errors;
            },
            passwordSuccessComputed() {
                const passwordField = this.$v.user.password;

                this.toggleFieldBgColor('password', passwordField);

                return !passwordField.$invalid;
            }
        },
        validations() {
            const passwordMinLength = signinConfig.fields.password.MIN_LENGTH;

            const validations = {
                user: {
                    email: {
                        required,
                        email
                    },
                    password: {
                        required,
                        minLength: minLength(passwordMinLength)
                    }
                }
            };

            return {
                user: validations.user
            };
        },
        methods: {
            isAmbientTests() {
                return isAmbientGeralTests && this.isAmbientLocalTests;
            },
            populateMock() {
                this.users = Object.assign(this.user, userMock);
            },
            populateGeral() {
                this.isAmbientTests() && this.populateMock();
            },
            checkStateFields() {
                for (const key of Object.keys(this.fields)) {
                    if (this.user[key] && this.user[key].length) {
                        this.toggleStatusActivedField(key);
                    }
                }
            },
            toggleStatusActivedField(nameField) {
                this.fields[nameField].btClose = !this.fields[nameField].btClose;
            },
            activeField(nameField) {
                this.fieldSelected = nameField;
            },
            closeField(nameField) {
                this.user[nameField] = null;

                this.activeField(nameField);

                this.focusField(nameField);

                this.fields[nameField].btClose = false;
            },
            getLabel(nameField) {
                return signinConfig.fields[nameField].LABEL;
            },
            toggleFieldBgColor(nameField, field) {
                this.fields[nameField].bgColor =
                    field.$dirty && field.$invalid
                        ? this.configs.fields.bgColor.error
                        : null;
            },
            changeColorField(field) {
                this.fields[field].bgColor = this.configs.fields.bgColor.error;
            },
            focusField(field) {
                this.$refs[field].focus();
            },
            validForm() {
                let valid = true,
                    key = null;

                const fields = {
                    email: {
                        status: this.emailSuccessComputed,
                        message: signinConfig.messages.email.errors.CHECK_EMAIL
                    },
                    password: {
                        status: this.passwordSuccessComputed,
                        message: signinConfig.messages.password.errors.CHECK_PASSWORD
                    }
                };

                for (const k of Object.keys(fields)) {
                    if (!fields[k].status) {
                        valid = false;
                        key = k;
                        break;
                    }
                }

                if (!valid) {
                    this.fieldNameActivated = key;

                    this.activeSnack(fields[key].message, false);
                }

                return valid;
            },
            closeSnack() {
                this.snackActivated = false;

                const nameField = this.fieldNameActivated;

                if (nameField) {
                    this.focusField(nameField);
                    this.changeColorField(nameField);
                }
            },
            activeSnack(message, success) {
                this.snackActivated = true;
                this.snackSuccess = success;
                this.snackMessage = message;
            },
            filterMessageError(e) {
                const { message } = JSON.parse(JSON.stringify(e));

                if (message === 'Network Error') {
                    return {
                        field: null,
                        message: 'Erro de conexão com a API!'
                    };
                } else {
                    const { error } = e.response.data.metadata;

                    const map = {
                        default: {
                            field: null,
                            message: 'Erro genérico!'
                        },
                        invalidEmailOrPassword: {
                            field: 'password',
                            message: 'Email ou senha inválida!'
                        }
                    };

                    const exists = map.hasOwnProperty(error);

                    return exists ? map[error] : map['default'];
                }
            },
            goToAfterSubmit(role) {
                const map = {
                    COMPANY: 'dash_company'
                };

                const exists = map.hasOwnProperty(role);

                if (exists) {
                    this.$router.push({ path: map[role] });
                }
            },
            saveDataInLocalStore(data) {
                localStorage.setItem(keyLocalStorage, JSON.stringify(data));
            },
            saveDataInStore(data) {
                this.$store.dispatch('setDataUser', data);
            },
            submitForm() {
                if (!this.validForm()) return;

                this.loadingActivated = true;

                const timeToProcess = this.isAmbientTests() ? 1500 : 1000;

                this.$service.http[geralConfig.service.http]
                    .signIn(this.user)
                    .then((result) => {
                        setTimeout(() => {
                            const { data } = result.data;

                            this.saveDataInStore(data);

                            const dataUserAdapted = dataUserAdapter(data);

                            this.saveDataInLocalStore(dataUserAdapted);

                            this.loadingActivated = false;

                            this.goToAfterSubmit(data.role);
                        }, timeToProcess);
                    })
                    .catch((e) => {
                        const { field, message } = this.filterMessageError(e);

                        if (field) {
                            this.fieldNameActivated = field;
                        }

                        setTimeout(() => {
                            this.activeSnack(message, false);

                            this.loadingActivated = false;
                        }, 1000);
                    });
            }
        }
    };
</script>

<style scoped>
    .btn-go-to {
        text-transform: none;
        font-weight: bold;
        letter-spacing: normal;
        background-color: #ffffff;
    }

    .forgot-password {
        display: flex;
        justify-content: center;
    }

    .field {
        padding: 0px !important;
        position: relative;
    }

    .close-field {
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: -20px;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    textarea:-webkit-autofill,
    textarea:-webkit-autofill:hover,
    textarea:-webkit-autofill:focus,
    select:-webkit-autofill,
    select:-webkit-autofill:hover,
    select:-webkit-autofill:focus {
        position: relative !important;
        transition: background-color 5000s ease-in-out 0s;
    }

    .box {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }
</style>
