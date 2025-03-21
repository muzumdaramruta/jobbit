import express from "express";
import {
    searchJobsController,
    getJob,
    updateJobController,
    deleteJob,
    createJobController,
    toggleSaveJob,
    applyJob,
    unapplyJob,
    viewApplications,
    acceptApplication,
    getJobsForCompanyController,
    jobApplicationsController,
} from "../controllers/jobController.js";
import protectRoute from "../authentication/protectRoute.js";

const router = express.Router();

// TODO add protectRoute
router.get("/", searchJobsController);
router.post("/", protectRoute, createJobController);

// user job routes
router.post("/toggle-save/:id", protectRoute, toggleSaveJob);
router.post("/apply/:id", protectRoute, applyJob);
router.post("/unapply/:id", protectRoute, unapplyJob);
router.get("/applied", protectRoute, viewApplications);
router.post("/acceptApplication/:id", protectRoute, acceptApplication);
router.get("/company/:id", protectRoute, getJobsForCompanyController);
router.get("/:id/applications", protectRoute, jobApplicationsController);

// general routes
router.get("/:id", getJob);
router.put("/:id", protectRoute, updateJobController);
router.delete("/:id", protectRoute, deleteJob);

export default router;
