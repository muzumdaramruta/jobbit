import Job from "../models/jobModel.js";
import Company from "../models/companyModel.js";

const saveJob = async (job) => {
    return await job.save();
};

const getAllJobs = async () => {
    return await Job.find({});
};

const findJobById = async (id) => {
    return await Job.findById(id);
};

const findJobDetailsById = async (id) => {
    return await Job.findById(id).populate("company");
};

const deleteJob = async (id) => {
    return await Job.findByIdAndDelete(id);
};

const searchJobsByQuery = async (query) => {
    if (!query) {
        // hide useless properties and get company details
        return await Job.find({}).populate(
            "company",
            "name location logoUrl -_id"
        );
    }
    return await Job.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { requirements: { $regex: query, $options: "i" } },
            { jobType: { $regex: query, $options: "i" } },
        ],
    });
};

// TODO need to add pagination
const searchJobs = async (query, location) => {
    const companies = await Company.find({
        location: { $regex: location, $options: "i" },
    });
    const companyIds = companies.map((company) => company._id);

    // query can be empty or null
    if (!query) {
        return await Job.find({ company: { $in: companyIds } });
    }
    return await Job.find({
        $and: [
            {
                $or: [
                    { title: { $regex: query, $options: "i" } },
                    { description: { $regex: query, $options: "i" } },
                    { requirements: { $regex: query, $options: "i" } },
                    { jobType: { $regex: query, $options: "i" } },
                ],
            },
            { company: { $in: companyIds } },
        ],
    });
};

export {
    saveJob,
    getAllJobs,
    findJobById,
    findJobDetailsById,
    deleteJob,
    searchJobsByQuery,
    searchJobs,
};
