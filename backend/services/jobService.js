import mongoose from "mongoose";
import {
    findJobById,
    findJobDetailsById,
    saveJob,
    searchJobsByQuery,
    deleteJob,
    searchJobs,
} from "../db/jobRepository.js";
import { findUserById, saveUser } from "../db/userRepository.js";
import { UserNotFoundError } from "../errors/userErrors.js";
import { JobInputError, JobNotFoundError } from "../errors/jobErrors.js";
import { ResourceNotFoundError } from "../errors/commonErrors.js";
import { CompanyNotFoundError } from "../errors/companyErrors.js";
import Job from "../models/jobModel.js";
import Company from "../models/companyModel.js";
import { validateJobType, isValidObjectId } from "../services/validation.js";
import Application from "../models/applicationModel.js";

const searchJobsService = async (query, location) => {
    if (location === undefined || location === null || location === "") {
        return await searchJobsByQuery(query);
    }
    return await searchJobs(query, location);
};

const findJobByIdService = async (jobId) => {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new JobInputError("Invalid job id");
    }
    const job = await findJobDetailsById(jobId);
    if (!job) {
        throw new JobNotFoundError();
    }
    return job;
};

const createNewJobService = async (
    companyId,
    title,
    description,
    requirements,
    salary,
    jobType,
    externalApplyLink,
    isOpen,
    userId
) => {
    if (!title || !description || !salary || !companyId || !jobType) {
        throw new JobInputError(
            "One or more missing fields: title, description, salary, companyId, jobType"
        );
    }
    if (isOpen === undefined) isOpen = true;

    isValidObjectId(companyId);
    validateJobType(jobType);
    const company = await Company.findById(companyId).exec();
    if (!company) {
        throw new CompanyNotFoundError("Company does not exist");
    }

    const newJob = new Job({
        title,
        description,
        company: companyId,
        applyLink: externalApplyLink,
        requirements: requirements.split(",").map((req) => req.trim()),
        salary,
        jobType,
        postedBy: userId,
        isOpen,
    });
    await saveJob(newJob);
    // add jobid to user postedJobs
    const user = await findUserById(userId);
    user.postedJobs.push(newJob._id);
    await saveUser(user);
    return newJob;
};

const updateJob = async (
    job,
    title,
    description,
    salary,
    jobType,
    requirements,
    isOpen
) => {
    if (title) {
        job.title = title;
    }
    if (description) {
        job.description = description;
    }
    if (salary) {
        job.salary = salary;
    }
    if (jobType) {
        job.jobType = jobType;
    }
    if (requirements) {
        job.requirements = requirements.split(",").map((req) => req.trim());
    }
    if (isOpen !== undefined) {
        job.isOpen = isOpen;
    }
    await saveJob(job);
    return job;
};

const removeJob = async (jobId) => {
    const job = await findJobById(jobId);
    if (!job) {
        throw new JobNotFoundError();
    }
    await deleteJob(jobId);
};

const toggleSaveJobForUser = async (userId, jobId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new UserNotFoundError();
    }
    const job = await findJobById(jobId);
    if (!job) {
        throw new JobNotFoundError();
    }

    const jobIndex = user.savedJobs.indexOf(jobId);
    if (jobIndex !== -1) {
        user.savedJobs.splice(jobIndex, 1);
    } else {
        user.savedJobs.push(jobId);
    }
    user.markModified("savedJobs");
    await saveUser(user);
};

const applyJobForUser = async (userId, jobId, resumeFile) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new UserNotFoundError();
    }
    const job = await findJobById(jobId);
    if (!job) {
        throw new JobNotFoundError();
    }

    // check if user has already applied
    const existingApplication = await Application.findOne({
        user: userId,
        job: jobId,
    });
    if (existingApplication) {
        throw new JobInputError("User has already applied for this job");
    }

    // create new application and save it
    const newApplication = new Application({
        user: userId,
        job: jobId,
        resume: {
            data: resumeFile.buffer,
            contentType: resumeFile.mimetype,
        },
    });
    await newApplication.save();

    // Update user document with applied job reference
    user.applications.push(newApplication._id);
    await saveUser(user);

    // Update job document with application reference
    job.applications.push(newApplication._id);
    await saveJob(job);
    return newApplication;
};

const unApplyJobForUser = async (userId, applicationId) => {
    try {
        const user = await findUserById(userId);
        if (!user) {
            throw new UserNotFoundError();
        }

        const application = await Application.findById(applicationId).exec();
        if (!application) {
            throw new ResourceNotFoundError("Application does not exist");
        }

        // Check if the application exists in the user's applications
        if (!user.applications.includes(applicationId)) {
            throw new ResourceNotFoundError(
                "User has not applied for this job"
            );
        }

        // Remove the application from the user's applications
        user.applications = user.applications.filter(
            (id) => id.toString() !== applicationId
        );
        await saveUser(user);

        // Remove the application from the job's applications
        const job = await Job.findById(application.job).exec();
        job.applications = job.applications.filter(
            (id) => id.toString() !== applicationId
        );
        await saveJob(job);

        // Delete the application
        await application.deleteOne();

        return { success: true };
    } catch (error) {
        // Handle errors
        console.error("Error in unApplyJobForUser:", error);
        throw error; // Rethrow the error for the caller to handle
    }
};

const getApplicationsForUser = async (userId) => {
    const user = await findUserById(userId);
    if (!user) {
        throw new UserNotFoundError();
    }
    // user.applications is an array of application ids
    // each application has a reference to the job it was applied to
    // return all the job with details that user has applied to
    const applications = await Application.find({
        _id: { $in: user.applications },
    }).exec();
    const jobs = await Job.find({
        _id: { $in: applications.map((app) => app.job) },
    }).exec();
    return jobs;
};

// accept application service
const acceptApplicationService = async (applicationId) => {
    const application = await Application.findById(applicationId).exec();
    if (!application) {
        throw new ResourceNotFoundError("Application does not exist");
    }
    // check if application is already accepted
    if (application.status === "Accepted") {
        throw new JobInputError("Application is already accepted");
    }
    application.status = "Accepted";
    await application.save();

    // update acceptedApplication in job
    const job = await Job.findById(application.job).exec();
    if (!job) {
        throw new JobNotFoundError("Job does not exist");
    }
    job.acceptedApplication = applicationId;
    await saveJob(job);
};

export {
    searchJobsService,
    findJobByIdService,
    createNewJobService,
    updateJob,
    removeJob,
    // user job related services
    toggleSaveJobForUser,
    applyJobForUser,
    unApplyJobForUser,
    getApplicationsForUser,
    acceptApplicationService,
};
