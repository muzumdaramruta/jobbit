class JobInputError extends Error {
    constructor(message) {
        super(message);
        this.name = "JobInputError";
    }
    get message() {
        return "Invalid Job Input";
    }
}

class JobNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "JobNotFoundError";
    }
    get message() {
        return "Job Not Found";
    }
}

export { JobInputError, JobNotFoundError };
