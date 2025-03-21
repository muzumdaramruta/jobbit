class UserNotFoundError extends Error {
    get message() {
        return "User Not Found";
    }
    get name() {
        return "UserNotFoundError";
    }
}

class UserAlreadyExistsError extends Error {
    get message() {
        return "User already exists";
    }
    get name() {
        return "UserAlreadyExistsError";
    }
}

class InvalidUserError extends Error {
    constructor(message) {
        super(message);
    }
    get message() {
        return "Invalid User";
    }
    get name() {
        return "InvalidUserError";
    }
}

class UserAccountFrozenError extends Error {
    get message() {
        return "User Account is Frozen";
    }
    get name() {
        return "UserAccountFrozenError";
    }
}

class UserInputError extends Error {
    constructor(message) {
        super(message);
    }
    get message() {
        return "Invalid User Input";
    }
    get name() {
        return "UserInputError";
    }
}

class UnAuthorizedError extends Error {
    constructor(message) {
        super(message);
    }
    get message() {
        return "Unauthorized";
    }
    get name() {
        return "UnAuthorizedError";
    }
}

export {
    UserNotFoundError,
    UserAlreadyExistsError,
    InvalidUserError,
    UserAccountFrozenError,
    UserInputError,
    UnAuthorizedError,
};
