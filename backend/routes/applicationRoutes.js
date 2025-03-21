import express from "express";
import protectRoute from "../authentication/protectRoute.js";
import {
    getApplication,
    getResume,
    updateApplicationStatusController,
} from "../controllers/applicationController.js";
const router = express.Router();

router.get("/:id/resume", getResume);
router.get("/:id", protectRoute, getApplication);
router.patch("/:id", protectRoute, updateApplicationStatusController);

export default router;
