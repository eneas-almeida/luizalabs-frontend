const map = {
    signIn: (data) => {
        const { email, password } = data;

        return {
            email,
            password
        };
    },
    signUp: (data) => {
        const { name, email, password, role } = data;

        return {
            name,
            email,
            role,
            password
        };
    }
};

export const dataAdapter = (service, data) => {
    const exists = map.hasOwnProperty(service);

    return exists ? map[service](data) : null;
};
