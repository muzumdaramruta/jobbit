import Review from "../models/reviewModel.js";
import Company from "../models/companyModel.js";
import { findCompanyById } from "../services/companyService.js";
import { UserRole } from "../models/enum.js";

// Get all reviews for a company from company id and populate the reviews field
const getCompanyReviews = async (req, res) => {
    try {
        const reviews = await Company.findById(req.params.id).populate(
            "reviews"
        );
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

const postCompanyReview = async (req, res) => {
    try {
        // req body will contain both the company id and the review
        const userId = req.user._id;
        let { companyId, title, description, rating } = req.body;
        const company = await findCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        const newReview = new Review({
            title,
            description,
            rating,
            user: userId,
        });
        await newReview.save();
        company.reviews.push(newReview);
        // update the company's average rating
        let totalRating = 0;
        company.reviews.forEach((review) => {
            totalRating += review.rating || 0;
        });
        company.rating = totalRating / company.reviews.length;
        company.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// currently only toggle isHidden field
const patchCompanyReview = async (req, res) => {
    try {
        const userId = req.user._id;

        if (req.user.userRole !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const reviewId = req.params.id;

        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        review.isHidden = !review.isHidden;
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// get top 5 popular reviews by rating
const getPopularReviewsController = async (req, res) => {
    try {
        const reviews = await Review.find({ isHidden: false })
            .sort({ rating: -1 })
            .limit(5)
            .populate("user", "name");
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

export {
    getCompanyReviews,
    postCompanyReview,
    patchCompanyReview,
    getPopularReviewsController,
};
