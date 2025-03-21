import {
    findAllUsers,
    findUserByEmail,
    findUserById,
    saveUser,
    findUserWithJobDetails,
} from "../db/userRepository.js";
import {
    InvalidUserError,
    UserAccountFrozenError,
    UserAlreadyExistsError,
    UserNotFoundError,
} from "../errors/userErrors.js";
import User from "../models/userModel.js";
import Application from "../models/applicationModel.js";
import { generateHash, isPasswordValid } from "./hashService.js";
import generateTokenAndSetCookie from "./authJwtService.js";
import {
    validateEmailField,
    validateNameField,
    validatePhoneField,
    validatePasswordField,
    validateUserRole,
} from "./validation.js";
import { UserRole } from "../models/enum.js";
import { findCompanyById } from "../db/companyRepository.js";
import mongoose from "mongoose";

const createNewUser = async (
    name,
    email,
    password,
    userRole,
    companyId,
    res
) => {
    const user = await findUserByEmail(email);

    validateNameField(name);
    validateEmailField(email);
    validatePasswordField(password);
    validateUserRole(userRole);

    if (userRole === UserRole.EMPLOYER) {
        if (!companyId) {
            throw new InvalidUserError("Company Id is required for employer");
        }

        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            throw new InvalidUserError("Invalid company id");
        }
        const company = await findCompanyById(companyId);
        if (!company) {
            throw new InvalidUserError("Company does not exist");
        }
    }

    if (user) {
        throw new UserAlreadyExistsError();
    }
    const hashedPassword = await generateHash(password);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        userRole,
        ...(userRole === UserRole.EMPLOYER && { company: companyId }),
    });
    await saveUser(newUser);

    if (newUser) {
        // generateTokenAndSetCookie(newUser._id, res);
        return {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isFrozen: newUser.isFrozen,
            userRole: newUser.userRole,
        };
    } else {
        throw new InvalidUserError("Invalid User Data");
    }
};

const userLoginAuth = async (email, password, res) => {
    validateEmailField(email);
    validatePasswordField(password);

    const user = await findUserByEmail(email);
    const hashedPassword = user ? user.password : null;
    const isPasswordCorrect = await isPasswordValid(password, hashedPassword);

    if (!user || !isPasswordCorrect) {
        throw new InvalidUserError("Invalid User Credentials");
    }

    if (user.isFrozen) {
        throw new UserAccountFrozenError();
    }

    generateTokenAndSetCookie(user._id, user.email, user.userRole, res);

    return {
        _id: user._id,
        email: user.email,
        userRole: user.userRole,
    };
};

const freezeUserById = async (id) => {
    const user = await findUserById(id);
    if (!user) {
        throw new UserNotFoundError();
    }
    user.isFrozen = true;
    await saveUser(user);
};

const freezeOrUnfreezeUserById = async (id) => {
    const user = await findUserById(id);
    if (!user) {
        throw new UserNotFoundError();
    }
    const freezeState = !user.isFrozen;
    user.isFrozen = freezeState;
    await saveUser(user);
    return freezeState;
};

const updateUserProfile = async (userId, name, phone, address, bio) => {
    if (name) {
        validateNameField(name);
    }
    if (phone) {
        validatePhoneField(phone);
    }
    let user = await findUserById(userId);
    if (!user) {
        throw new UserNotFoundError();
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    user = await saveUser(user);

    // password should be null in response
    user.password = null;

    return user;
};

const fetchAllUsers = async () => {
    return await findAllUsers();
};

const fetchUserProfile = async (userId) => {
    const user = await findUserWithJobDetails(userId);
    const applicationDetails = [];
    for (const application of user.applications) {
        // get jobId and populate job details
        const applicationDetail = await Application.findById(
            application._id
        ).populate("job");
        applicationDetails.push(applicationDetail);
    }
    return {
        savedJobs: user.savedJobs,
        postedJobs: user.postedJobs,
        applications: applicationDetails,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        userType: user.userRole,
        address: user.address,
        bio: user.bio,
    };
};

// for others to see, so only public info
const fetchOtherUserProfile = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new UserNotFoundError();
    }
    return {
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        address: user.address,
        bio: user.bio,
    };
};

export {
    createNewUser,
    userLoginAuth,
    freezeUserById,
    updateUserProfile,
    freezeOrUnfreezeUserById,
    fetchAllUsers,
    fetchUserProfile,
    fetchOtherUserProfile,
};
