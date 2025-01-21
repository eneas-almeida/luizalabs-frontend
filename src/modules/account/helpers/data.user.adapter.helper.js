export const dataUserAdapter = (data) => {
    const { id, name, role, email, token } = data;

    return {
        id,
        name,
        role,
        email,
        token
    };
};
