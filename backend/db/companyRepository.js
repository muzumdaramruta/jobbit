import Company from "../models/companyModel.js";
import Review from "../models/reviewModel.js";

const findCompanyDetailsById = async (id) => {
    return await Company.findOne({ _id: id })
        .select("-updatedAt")
        .populate({
            path: "reviews",
            options: { sort: { createdAt: -1 } }, // Sorting reviews in descending order by createdAt field
        })
        .populate({
            path: "reviews.user",
            select: "name email",
        })
        .populate("photos");
};

const findCompanyById = async (id) => {
    return await Company.findOne({ _id: id });
};

const createCompany = async (company) => {
    return await company.save();
};

// delete company
const deleteCompany = async (id) => {
    return await Company.deleteOne({ _id: id });
};

const updateCompanyDetails = async (
    id,
    name,
    description,
    location,
    industry
) => {
    console.log("Updating company details with id: ", id);
    return await Company.findOneAndUpdate(
        { _id: id },
        { name, description, location, industry },
        { new: true }
    );
};

export {
    findCompanyDetailsById,
    createCompany,
    deleteCompany,
    updateCompanyDetails,
    findCompanyById,
};
