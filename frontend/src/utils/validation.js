const nameRegex = /^([A-Za-z]+(?: [A-Za-z]+)*)$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@northeastern\.edu$/;
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
const phoneRegex = /^[0-9]{10}$/;

export const validateEmail = (value) => {
    return emailRegex.test(value);
};

export const validatePassword = (value) => {
    return passwordRegex.test(value);
};

export const validateName = (value) => {
    return nameRegex.test(value);
};

export const validatePhone = (value) => {
    return phoneRegex.test(value);
};