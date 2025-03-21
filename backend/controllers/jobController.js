import {
    searchJobsService,
    findJobByIdService,
    createNewJobService,
    updateJob,
    removeJob,
    toggleSaveJobForUser,
    applyJobForUser,
    unApplyJobForUser,
    getApplicationsForUser,
    acceptApplicationService,
} from "../services/jobService.js";
import { UserRole } from "../models/enum.js";
import multer from "multer";
import { JobInputError } from "../errors/jobErrors.js";
import { JobNotFoundError } from "../errors/jobErrors.js";
import { ResourceNotFoundError } from "../errors/commonErrors.js";
import Application from "../models/applicationModel.js";
import Job from "../models/jobModel.js";
import Company from "../models/companyModel.js";

const upload = multer({
    storage: multer.memoryStorage(),
});

const searchJobsController = async (req, res) => {
    // read query parameters
    const query = req.query.query;
    const location = req.query.location;
    try {
        const jobs = await searchJobsService(query, location);
        return res.json(jobs);
    } catch (error) {
        console.error("Error in searchJobsController:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get a job given id
const getJob = async (req, res) => {
    const jobId = req.params.id;
    try {
        let job = await findJobByIdService(jobId);
        res.status(200).json(job);
    } catch (err) {
        console.log("Error in getJob: ", err.message);
        if (err.name == "JobNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// create a new job
const createJobController = async (req, res) => {
    req.body;
    const {
        companyId,
        title,
        description,
        requirements,
        salary,
        jobType,
        externalApplyLink,
        isOpen,
    } = req.body;
    try {
        if (req.user.userRole !== UserRole.ADMIN) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        let job = await createNewJobService(
            companyId,
            title,
            description,
            requirements,
            salary,
            jobType,
            externalApplyLink,
            isOpen,
            req.user._id
        );
        res.status(201).json(job);
    } catch (err) {
        console.log("Error in createJob: ", err.message);
        if (err.name == "JobInputError") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// update job
const updateJobController = async (req, res) => {
    const jobId = req.params.id;
    const { title, description, salary, jobType, requirements, isOpen } =
        req.body;
    try {
        // only employer can update job
        if (req.user.userRole !== UserRole.EMPLOYER) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        // check if job exists
        const job = await findJobByIdService(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        const updatedJob = await updateJob(
            job,
            title,
            description,
            salary,
            jobType,
            requirements,
            isOpen
        );
        return res.status(200).json(updatedJob);
    } catch (err) {
        console.log("Error in updateJob: ", err.message);
        if (err.name == "JobNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// delete job
const deleteJob = async (req, res) => {
    try {
        // check if job exists
        const job = await findJobByIdService(req.params.id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }

        const user = req.user;
        // user can delete only if he is admin or the postedBy field contains his id
        if (req.user.userRole !== UserRole.ADMIN) {
            if (job.postedBy.toString() !== user._id.toString()) {
                return res.status(403).json({ error: "Unauthorized" });
            }
        }
        await removeJob(req.params.id);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log("Error in deleteJob: ", err.message);
        if (err.name == "JobNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// toggle save job
const toggleSaveJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobId = req.params.id;
        const user = await toggleSaveJobForUser(userId, jobId);
        return res.status(200).json(user);
    } catch (err) {
        if (err.name == "UserNotFoundError" || err.name == "JobNotFoundError") {
            return res.status(404).json({ error: "Resource not found" });
        }
        console.log("Error in toggleSaveJob: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// controller for user to apply to a job
const applyJob = async (req, res) => {
    try {
        // Only employees can apply
        if (req.user.userRole !== UserRole.EMPLOYEE) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        // Handle file upload
        upload.single("resume")(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ error: "File upload error" });
            } else if (err) {
                return res.status(500).json({ error: err.message });
            }
            const userId = req.user._id;
            const jobId = req.params.id;

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({ error: "Resume required" });
            }

            // Pass the file data to applyJobForUser
            try {
                const application = await applyJobForUser(
                    userId,
                    jobId,
                    req.file
                );
                return res.status(200).json(application);
            } catch (error) {
                if (error instanceof JobInputError) {
                    return res.status(400).json({ error: error.message });
                }
                // Handle other errors
                console.error("Error in applyJobForUser:", error);
                return res.status(500).json({ error: "Internal server error" });
            }
        });
    } catch (err) {
        if (err.name == "InvalidUserError" || err.name == "UserInputError") {
            return res.status(400).json({ error: err.message() });
        }
        if (err.name == "UserDoesNotExist" || err.name == "JobNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        console.error("Error in applyJob:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// controller for user to unapply to a job
const unapplyJob = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobId = req.params.id;
        const user = await unApplyJobForUser(userId, jobId);
        return res.status(200).json(user);
    } catch (err) {
        if (err.name == "JobInputError") {
            return res.status(400).json({
                error: "User has not applied for this job",
            });
        }
        if (err.name == "UserNotFoundError" || err.name == "JobNotFoundError") {
            return res.status(404).json({ error: "Resource not found" });
        }
        console.log("Error in unapplyJob: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// controller for user to view applied jobs
const viewApplications = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobs = await getApplicationsForUser(userId);
        return res.status(200).json(jobs);
    } catch (err) {
        if (err.name == "UserNotFoundError") {
            return res.status(400).json({ error: "Invalid User" });
        }
        console.log("Error in viewApplications: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const jobApplicationsController = async (req, res) => {
    try {
        const userId = req.user._id;
        const jobId = req.params.id;
        const job = await Job.findById(jobId).exec();
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        if (job.postedBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        const applications = await Application.find({ job: jobId })
            .populate("user")
            .exec();
        return res.status(200).json(applications);
    } catch (err) {
        console.log("Error in jobApplicationsController: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

// employer accepts an application which changes the status of the application to accepted
const acceptApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const userId = req.user._id;
        // user can accept only if he is admin or the job corresponding to the application was posted by him
        const application = await Application.findById(applicationId)
            .populate("job")
            .exec();
        if (!application) {
            throw new ResourceNotFoundError("Application does not exist");
        }
        const job = await Job.findById(application.job).exec();
        if (!job) {
            throw new JobNotFoundError();
        }
        if (req.user.userRole !== UserRole.ADMIN) {
            if (job.postedBy.toString() !== userId.toString()) {
                return res.status(403).json({ error: "Unauthorized" });
            }
        }
        const result = await acceptApplicationService(applicationId);
        return res.status(200).json(result);
    } catch (err) {
        if (err.name == "ApplicationNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        if (err.name == "JobNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        if (err.name == "JobInputError") {
            return res.status(400).json({ error: err.message });
        }
        console.log("Error in acceptApplication: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const getJobsForCompanyController = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId).exec();
        if (!company) {
            return res.status(404).json({ error: "Company not found" });
        }
        const jobs = await Job.find({ company: companyId }).exec();
        return res.status(200).json(jobs);
    } catch (err) {
        console.log("Error in getJobsForCompanyController: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

export {
    searchJobsController,
    getJob,
    createJobController,
    updateJobController,
    deleteJob,
    // user job related controllers
    toggleSaveJob,
    applyJob,
    unapplyJob,
    viewApplications,
    acceptApplication,
    getJobsForCompanyController,
    jobApplicationsController,
};
