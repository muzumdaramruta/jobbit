import express from "express";
import {
    loginUser,
    logoutUser,
    signupUser,
    updateUser,
    getUserProfileController,
    getAllUserDetaulsController,
    toggleFreezeUserController,
    getOtherUserProfileController,
} from "../controllers/userController.js";
import protectRoute from "../authentication/protectRoute.js";
const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update/", protectRoute, updateUser);
router.get("/profile", protectRoute, getUserProfileController);
router.get("/profile/:id", protectRoute, getOtherUserProfileController);
router.get("/", protectRoute, getAllUserDetaulsController);
router.patch("/toggle-freeze/:id", protectRoute, toggleFreezeUserController);

export default router;
