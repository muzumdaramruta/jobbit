class CompanyInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "CompanyInputError";
    }
}

class CompanyNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "CompanyNotFoundError";
    }
}

export { CompanyInputError, CompanyNotFoundError };
