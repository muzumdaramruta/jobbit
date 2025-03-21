import { InvalidUserError } from "../errors/userErrors.js";
import {
    fetchAllUsers,
    freezeOrUnfreezeUserById,
    freezeUserById,
    createNewUser,
    updateUserProfile,
    userLoginAuth,
    fetchUserProfile,
    fetchOtherUserProfile,
} from "../services/userService.js";
import { UserRole } from "../models/enum.js";

const signupUser = async (req, res) => {
    try {
        const { name, email, password, userRole, companyId } = req.body;

        const newUserDetails = await createNewUser(
            name,
            email,
            password,
            userRole,
            companyId,
            res
        );
        return res.status(201).json(newUserDetails);
    } catch (err) {
        console.error("Error in signupUser: ", err.message);
        if (
            err.name == "UserAlreadyExistsError" ||
            err.name == "InvalidUserError" ||
            err.name == "UserInputError"
        ) {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await userLoginAuth(email, password, res);
        res.status(200).json(userDetails);
    } catch (error) {
        console.error("Error in loginUser: ", error.message);
        if (
            error.name == "InvalidUserError" ||
            error.name == "UserAccountFrozenError" ||
            error.name == "UserInputError"
        ) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        return res
            .status(200)
            .json({ message: "User logged out successfully" });
    } catch (err) {
        console.error("Error in logoutUser: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { name, phone, address, bio } = req.body;
    const userId = req.user._id;
    try {
        let user = await updateUserProfile(userId, name, phone, address, bio);
        return res.status(200).json(user);
    } catch (err) {
        if (err.name == "InvalidUserError" || err.name == "UserInputError") {
            return res.status(400).json({ error: err.message });
        }
        if (err.name == "UserDoesNotExist") {
            return res.status(404).json({ error: err.message });
        }
        console.error("Error in updateUser: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const getAllUserDetaulsController = async (req, res) => {
    try {
        if (req.user.userRole !== UserRole.ADMIN) {
            throw new InvalidUserError("Admin Access Required");
        }
        const users = await fetchAllUsers();
        return res.json(users);
    } catch (error) {
        if (error.name == "InvalidUserError") {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

const getUserProfileController = async (req, res) => {
    try {
        const user = await fetchUserProfile(req.user._id);
        if (!user) {
            throw new InvalidUserError("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        if (error.name == "InvalidUserError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

const getOtherUserProfileController = async (req, res) => {
    try {
        const user = await fetchOtherUserProfile(req.params.id);
        if (!user) {
            throw new InvalidUserError("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error in getOtherUserProfileController: ", error);
        if (error.name == "InvalidUserError") {
            return res.status(404).json({ error: error.message });
        } else if (error.name == "UserNotFoundError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

const toggleFreezeUserController = async (req, res) => {
    if (req.user.userRole !== UserRole.ADMIN) {
        return res.status(403).json({ error: "Admin Access Required" });
    }
    const id = req.params.id;
    if (id === req.user._id.toString()) {
        return res.status(403).json({ error: "Cannot freeze own account" });
    }
    try {
        const isFrozen = await freezeOrUnfreezeUserById(id);
        return res.status(200).json({ isFrozen: isFrozen });
    } catch (error) {
        if (error.name == "InvalidUserError") {
            return res.status(403).json({ error: error.message });
        }
        if (error.name == "UserNotFoundError") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export {
    signupUser,
    loginUser,
    logoutUser,
    updateUser,
    getAllUserDetaulsController,
    getUserProfileController,
    toggleFreezeUserController,
    getOtherUserProfileController,
};
