import express from "express";
import protectRoute from "../authentication/protectRoute.js";
import {
    getAllCompaniesController,
    getCompany,
    createCompanyController,
    updateCompanyController,
    deleteCompany,
    uploadPhoto,
} from "../controllers/companyController.js";

const router = express.Router();

// TODO add protectRoute
router.get("/", getAllCompaniesController);
router.get("/:id", getCompany);
router.post("/", protectRoute, createCompanyController);
router.put("/:id", protectRoute, updateCompanyController);
router.delete("/:id", protectRoute, deleteCompany);
router.post("/:id/photos", protectRoute, uploadPhoto);

export default router;
