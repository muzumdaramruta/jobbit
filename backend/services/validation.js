import { UserInputError, UnAuthorizedError } from "../errors/userErrors.js";
import { UserRole, JobType } from "../models/enum.js";
import mongoose from "mongoose";

const testRegex = (pattern, str) => {
    return pattern.test(str);
};

const isValidName = (name) => {
    // return testRegex(/^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/, name)
    return testRegex(/^([A-Za-z]+(?: [A-Za-z]+)*)$/, name);
};

const isValidPassword = (password) => {
    return testRegex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/,
        password
    );
};

const isValidEmail = (email) => {
    return testRegex(/^[A-Za-z0-9._%+-]+@northeastern\.edu$/, email);
};

const validateEmailField = (email) => {
    if (email == null) {
        throw new UserInputError("Email required");
    }
    if (email.length > 60) {
        throw new UserInputError("Email is too long");
    }
    if (!isValidEmail(email)) {
        throw new UserInputError("Email validation failed");
    }
};

const validateNameField = (name) => {
    if (name == null) {
        throw new UserInputError("Name required");
    }
    if (name.length > 60) {
        throw new UserInputError("Name is too long");
    }
    if (!isValidName(name)) {
        throw new UserInputError("Name validation failed");
    }
};

const validatePasswordField = (password) => {
    if (password == null) {
        throw new UserInputError("Password required");
    }
    if (password.length > 60) {
        throw new UserInputError("Password is too long");
    }
    if (!isValidPassword(password)) {
        throw new UserInputError("Password validation failed");
    }
};

const validatePhoneField = (phone) => {
    return testRegex(/^[0-9]{10}$/, phone);
};

const validateJobType = (jobType) => {
    if (!Object.values(JobType).includes(jobType)) {
        throw new UserInputError("Invalid job type");
    }
};

const validateUserRole = (userRole) => {
    // one of "Employer", "Employee", "Admin"
    if (!Object.values(UserRole).includes(userRole)) {
        throw new UserInputError("Invalid user role");
    }
};

const isValidObjectId = (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError("Invalid ObjectId");
    }
};

// check if userRole in req is admin
const isAdmin = (req) => {
    if (req.user.userRole !== UserRole.ADMIN) {
        throw new UnAuthorizedError("Unauthorized");
    }
};

export {
    validateEmailField,
    validateNameField,
    validatePasswordField,
    validatePhoneField,
    validateUserRole,
    validateJobType,
    isValidObjectId,
    isAdmin,
};
