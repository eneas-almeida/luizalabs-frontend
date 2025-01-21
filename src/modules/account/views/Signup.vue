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

                    <v-card-text v-if="submitedForm">
                        <v-container class="box-submited">
                            <h1 class="info-title">Conta criada!</h1>
                            <p class="info-msg">Sua conta foi criada com sucesso!</p>
                            <p>Reedirecionando em {{ timeToRedirect }} segundos...</p>
                        </v-container>
                    </v-card-text>

                    <v-card-text v-else>
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-container class="field">
                                            <CloseField
                                                :name="'name'"
                                                :activated="
                                                    getStatusFieldComputed('name')
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getNameLabelByRoleComputed"
                                                :disabled="loadingActivated"
                                                ref="name"
                                                :background-color="fields.name.bgColor"
                                                :append-icon="
                                                    getIconFieldComputed('name')
                                                "
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="$v.user.name.$model"
                                                :error-messages="nameErrorsComputed"
                                                :success="nameSuccessComputed"
                                                @select="selectField('name')"
                                                @focus="selectField('name')">
                                            </v-text-field>
                                        </v-container>

                                        <v-container class="field">
                                            <CloseField
                                                :name="'email'"
                                                :activated="
                                                    getStatusFieldComputed('email')
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getLabelField('email')"
                                                ref="email"
                                                :disabled="loadingActivated"
                                                type="email"
                                                :background-color="fields.email.bgColor"
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="$v.user.email.$model"
                                                :error-messages="emailErrorsComputed"
                                                :success="emailSuccessComputed"
                                                @select="selectField('email')"
                                                @focus="selectField('email')">
                                            </v-text-field>
                                        </v-container>
                                    </v-col>
                                </v-row>

                                <v-row>
                                    <v-col>
                                        <v-container class="field">
                                            <CloseField
                                                :name="'password'"
                                                :activated="
                                                    getStatusFieldComputed('password')
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getLabelField('password')"
                                                :disabled="loadingActivated"
                                                :type="getFieldTypePasswordComputed"
                                                :append-icon="
                                                    getIconFieldComputed('password')
                                                "
                                                name="password"
                                                ref="password"
                                                :background-color="
                                                    fields.password.bgColor
                                                "
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="$v.user.password.$model"
                                                :error-messages="passwordErrorsComputed"
                                                :success="passwordSuccessComputed"
                                                @click:append="
                                                    isTypeFieldPassword =
                                                        !isTypeFieldPassword
                                                "
                                                @select="selectField('password')"
                                                @focus="selectField('password')">
                                            </v-text-field>
                                        </v-container>
                                    </v-col>
                                    <v-col>
                                        <v-container class="field">
                                            <CloseField
                                                :name="'confirmPassword'"
                                                :activated="
                                                    getStatusFieldComputed(
                                                        'confirmPassword'
                                                    )
                                                "
                                                @closeSpeficField="closeField($event)" />

                                            <v-text-field
                                                :label="getLabelField('confirmPassword')"
                                                :disabled="loadingActivated"
                                                type="password"
                                                name="confirmPassword"
                                                ref="confirmPassword"
                                                :background-color="
                                                    fields.confirmPassword.bgColor
                                                "
                                                filled
                                                rounded
                                                dense
                                                v-model.trim="
                                                    $v.user.confirmPassword.$model
                                                "
                                                :error-messages="
                                                    confirmPasswordErrorsComputed
                                                "
                                                :success="confirmPasswordSuccessComputed"
                                                @select="selectField('confirmPassword')"
                                                @focus="selectField('confirmPassword')">
                                            </v-text-field>
                                        </v-container>
                                    </v-col>
                                    <v-col cols="12" class="check">
                                        <v-checkbox
                                            :label="titles.terms"
                                            class="check check-field"
                                            v-model="acceptTermsActivated"
                                            :disabled="loadingActivated">
                                        </v-checkbox>

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
                <v-container class="box" v-if="!submitedForm">
                    <GoTo
                        :title="titles.goToSignIn"
                        :icon="'person'"
                        :route="'signin'"
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
    import { keyLocalStorage, isAmbientGeralTests } from '@/configs/global.config';
    import { dataUserAdapter } from '@/modules/account/helpers/data.user.adapter.helper';
    import geralConfig from '../configs/geral.config';
    import signupConfig from '../configs/signup.config';
    import userMock from '../mocks/sigup.mock';
    import GoTo from '../components/geral/GoToButton.vue';
    import SubmitFormButton from '../components/geral/SubmitFormButton.vue';

    export default {
        name: 'Signup',
        components: { SanackBar, CloseField, GoTo, SubmitFormButton },
        data() {
            return {
                submitedForm: false,
                isAmbientLocalTests: true,
                loadingActivated: false,
                snackActivated: false,
                snackSuccess: false,
                snackMessage: null,
                acceptTermsActivated: false,
                fieldNameActivated: null,
                fieldSelected: null,
                isTypeFieldPassword: true,
                timeToRedirect: 10,
                user: {
                    name: null,
                    email: null,
                    password: null,
                    confirmPassword: null,
                    role: 'COMPANY'
                },
                titles: {
                    toolbar: signupConfig.titles.SECTOR,
                    goToSignIn: signupConfig.geral.buttons.SIGNIN,
                    terms: signupConfig.fields.acceptTerms.LABEL,
                    submitButton: signupConfig.buttons.SUBMIT
                },
                configs: {
                    fields: {
                        bgColor: {
                            error: '#ffffcc'
                        }
                    }
                },
                fields: {
                    name: {
                        bgColor: null,
                        btClose: false
                    },
                    email: {
                        bgColor: null,
                        btClose: false
                    },
                    password: {
                        bgColor: null,
                        btClose: false
                    },
                    confirmPassword: {
                        bgColor: null,
                        btClose: false
                    }
                }
            };
        },
        mounted() {
            this.populateGeral();

            this.selectField('name');

            this.changeColorField('name');

            this.focusField('name');

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
            getFieldTypePasswordComputed() {
                return this.isTypeFieldPassword ? 'password' : 'text';
            },
            getNameLabelByRoleComputed() {
                const map = {
                    MANAGER: 'Nome'
                };

                const userRole = this.user.role;

                const exists = map.hasOwnProperty(userRole);

                return exists ? map[userRole] : 'Nome';
            },
            getIconFieldComputed() {
                return (nameField) => {
                    if (nameField === 'name') {
                        return signupConfig.fields.name.icon.get(this.user.role);
                    }

                    if (nameField === 'password') {
                        return signupConfig.fields.password.icon.get(
                            this.isTypeFieldPassword
                        );
                    }
                };
            },
            nameErrorsComputed() {
                const nameField = this.$v.user.name;

                if (!nameField.$dirty) {
                    return [];
                }

                const errors = [];

                !nameField.required &&
                    errors.push(signupConfig.messages.name.alerts.MANDATORY_NAME);

                !nameField.minLength &&
                    errors.push(signupConfig.messages.name.errors.NAME_VALID);

                return errors;
            },
            nameSuccessComputed() {
                const nameField = this.$v.user.name;

                this.toggleFieldBgColor('name', nameField);

                return !nameField.$invalid;
            },
            emailErrorsComputed() {
                const emailField = this.$v.user.email;

                if (!emailField.$dirty) {
                    return [];
                }

                const errors = [];

                !emailField.required &&
                    errors.push(signupConfig.messages.email.alerts.MANDATORY_EMAIL);

                !emailField.email &&
                    errors.push(signupConfig.messages.email.errors.EMAIL_VALID);

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
                    errors.push(signupConfig.messages.password.alerts.MANDATORY_PASSWORD);

                const minFieldLength = signupConfig.fields.password.MIN_LENGTH;

                !passwordField.minLength &&
                    errors.push(
                        signupConfig.messages.password.alerts.MIN_LENGTH_PASSWORD(
                            minFieldLength
                        )
                    );

                return errors;
            },
            passwordSuccessComputed() {
                const passwordField = this.$v.user.password;

                this.toggleFieldBgColor('password', passwordField);

                return !passwordField.$invalid;
            },
            confirmPasswordErrorsComputed() {
                const confirmPasswordField = this.$v.user.confirmPassword;

                if (!confirmPasswordField.$dirty) {
                    return [];
                }

                const errors = [];

                !confirmPasswordField.required &&
                    errors.push(
                        signupConfig.messages.confirmPassword.alerts
                            .MANDATORY_CONFIRM_PASSWORD
                    );

                const minFieldLength = signupConfig.fields.password.MIN_LENGTH;

                !confirmPasswordField.minLength &&
                    errors.push(
                        signupConfig.messages.password.alerts.MIN_LENGTH_PASSWORD(
                            minFieldLength
                        )
                    );

                return errors;
            },
            confirmPasswordSuccessComputed() {
                const confirmPasswordField = this.$v.user.confirmPassword;

                this.toggleFieldBgColor('confirmPassword', confirmPasswordField);

                return !confirmPasswordField.$invalid;
            }
        },
        validations() {
            const nameMinLength = signupConfig.fields.name.MIN_LENGTH;
            const passwordMinLength = signupConfig.fields.password.MIN_LENGTH;

            const validations = {
                user: {
                    name: {
                        required,
                        minLength: minLength(nameMinLength)
                    },
                    email: {
                        required,
                        email
                    },
                    password: {
                        required,
                        minLength: minLength(passwordMinLength)
                    },
                    confirmPassword: {
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
            redirectTo(role) {
                const map = {
                    company: 'dashCompany'
                };

                role = role.toLowerCase();

                const exists = map.hasOwnProperty(role);

                if (exists) {
                    this.$router.push({ name: map[role] });
                }
            },
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
            selectField(nameField) {
                this.fieldSelected = nameField;
            },
            closeField(nameField) {
                this.user[nameField] = null;

                this.selectField(nameField);

                this.focusField(nameField);

                this.fields[nameField].btClose = false;
            },
            selectAndFocusField(nameField) {
                this.selectField(nameField);

                this.focusField(nameField);
            },
            getLabelField(nameField) {
                return signupConfig.fields[nameField].LABEL;
            },
            clearUserData() {
                Object.keys(this.user).forEach((key) => {
                    this.user[key] = null;
                });

                this.user['role'] = 'USER';
            },
            toggleFieldBgColor(nameField, field) {
                this.fields[nameField].bgColor =
                    field.$dirty && field.$invalid
                        ? this.configs.fields.bgColor.error
                        : null;
            },
            changeColorField(nameField) {
                this.fields[nameField].bgColor = this.configs.fields.bgColor.error;
            },
            focusField(nameField) {
                this.$refs[nameField].focus();
            },
            closeSnack() {
                this.snackActivated = false;

                const nameField = this.fieldNameActivated;

                if (nameField && !['terms'].includes(nameField)) {
                    this.focusField(nameField);
                    this.changeColorField(nameField);
                }
            },
            activeSnack(message, success) {
                this.snackActivated = true;
                this.snackSuccess = success;
                this.snackMessage = message;
            },
            validateName() {
                let status = true,
                    message = null;

                if (!this.nameSuccessComputed) {
                    status = false;
                    message = signupConfig.messages.name.alerts.CHECK_NAME;
                } else {
                    const nameField = this.user.name;

                    if (nameField.length < 3 || nameField.length > 32) {
                        status = false;
                        message = signupConfig.messages.name.errors.CHECK_NAME;
                    }
                }

                return {
                    status,
                    message
                };
            },
            checkPasswordEquals() {
                return this.user.password === this.user.confirmPassword;
            },
            validForm() {
                let valid = true,
                    key = null;

                const fields = {
                    name: {
                        ...this.validateName()
                    },
                    email: {
                        status: this.emailSuccessComputed,
                        message: signupConfig.messages.email.errors.CHECK_EMAIL
                    },
                    password: {
                        status: this.passwordSuccessComputed,
                        message: signupConfig.messages.password.errors.CHECK_PASSWORD
                    },
                    confirmPassword: {
                        status: this.confirmPasswordSuccessComputed,
                        message:
                            signupConfig.messages.confirmPassword.errors
                                .CHECK_CONFIRM_PASSWORD
                    },
                    passwordsEquals: {
                        status: this.checkPasswordEquals(),
                        message:
                            signupConfig.messages.passwordEquals.errors.PASSWORD_EQUALS
                    },
                    terms: {
                        status: this.acceptTermsActivated,
                        message:
                            signupConfig.messages.checkTerms.errors.CHECK_CONFIRM_PASSWORD
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
                    if (key === 'passwordsEquals') {
                        key = 'confirmPassword';
                    }

                    this.fieldNameActivated = key;

                    this.activeSnack(fields[key].message, false);
                }

                return valid;
            },
            filterMessageError(e) {
                const { message } = JSON.parse(JSON.stringify(e));

                if (message === 'Network Error') {
                    return {
                        field: null,
                        message: 'Erro de conexão com a API!'
                    };
                } else {
                    const { error } = e.response.data.status.payload;

                    const map = {
                        default: {
                            field: null,
                            message: 'Erro genérico!'
                        },
                        NameInvalid: {
                            field: 'name',
                            message: 'Insira seu nome e sobrenome corretamente!'
                        },
                        EmailInvalid: {
                            field: 'email',
                            message: 'Insira um email válido!'
                        },
                        PasswordInvalid: {
                            field: 'password',
                            message: 'Insira uma senha válida!'
                        },
                        EmailAlreadyExists: {
                            field: 'email',
                            message: `Já existe um usuário cadastrado com o e-mail ${this.user.email}!`
                        }
                    };

                    const exists = map.hasOwnProperty(error);

                    return exists ? map[error] : map['default'];
                }
            },
            goToAfterSubmit() {
                this.submitedForm = true;

                const interval = setInterval(() => {
                    this.timeToRedirect--;
                }, 1000);

                setTimeout(() => {
                    clearInterval(interval);

                    this.redirectTo(this.user.role);
                }, 10000);
            },
            submitForm() {
                if (!this.validForm()) return;

                this.loadingActivated = true;

                let timeToProcess = this.isAmbientTests() ? 2500 : 1500;

                this.$service.http[geralConfig.service.http]
                    .signUp(this.user)
                    .then((result) => {
                        setTimeout(() => {
                            const dataUserAdapted = dataUserAdapter(result.data.data);

                            const json = JSON.stringify(dataUserAdapted);

                            localStorage.setItem(keyLocalStorage, json);

                            this.$store.dispatch('setDataUser', dataUserAdapted);

                            this.loadingActivated = false;

                            this.goToAfterSubmit();
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
                        }, 2000);
                    });
            }
        }
    };
</script>

<style scoped>
    .box {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .btn-go-to {
        text-transform: none;
        font-weight: bold;
        letter-spacing: normal;
        background-color: #ffffff;
    }

    .box-submited {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
        text-align: center;
    }

    .box-submited .info-title {
        margin-top: 10px;
    }

    .box-submited .info-msg {
        margin-top: 10px;
    }

    .label-profile {
        font-weight: bold;
    }

    .profile {
        padding-top: 0px;
        margin-top: 10px !important;
        margin-bottom: 15px;
    }

    .field {
        padding: 0px !important;
        position: relative;
    }

    .field-profile {
        margin-left: 10px !important;
    }

    .close-field {
        cursor: pointer;
        position: absolute;
        right: 15px;
        top: -20px;
    }

    .text-normal {
        text-transform: none;
        font-weight: bold;
        letter-spacing: normal;
    }

    .check {
        margin-top: 5px !important;
        padding-top: 0px !important;
    }

    .check-field {
        margin-left: 10px;
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

    .v-input--switch .v-label {
        color: #888888;
    }

    .v-input--is-label-active .v-label {
        color: #7b009c;
    }
</style>
