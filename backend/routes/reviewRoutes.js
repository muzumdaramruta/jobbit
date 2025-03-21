import express from "express";
import protectRoute from "../authentication/protectRoute.js";
import {
    getCompanyReviews,
    postCompanyReview,
    patchCompanyReview,
    getPopularReviewsController,
} from "../controllers/reviewController.js";

const router = express.Router();

// TODO add protectRoute
router.get("/", protectRoute, getCompanyReviews);
router.post("/", protectRoute, postCompanyReview);
router.patch("/:id", protectRoute, patchCompanyReview);
router.get("/popular", getPopularReviewsController);

export default router;
