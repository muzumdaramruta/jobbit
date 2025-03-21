import { findApplicationByIdService } from "../services/applicationService.js";

const getApplication = async (req, res) => {
    const applicationId = req.params.id;
    const userId = req.user._id;
    try {
        // user should be either the applicant or the employer who posted the job
        let application = await findApplicationByIdService(applicationId);
        if (
            application.user.toString() !== userId.toString() &&
            application.job.postedBy.toString() !== userId.toString()
        ) {
            return res.status(403).json({ error: "Forbidden" });
        }
        res.status(200).json(application);
    } catch (err) {
        console.log("Error in getApplication: ", err.message);
        if (err.name == "ResourceNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// download resume
const getResume = async (req, res) => {
    const applicationId = req.params.id;
    try {
        const application = await findApplicationByIdService(applicationId);
        if (!application.resume) {
            throw new ResourceNotFoundError("Resume not found");
        }
        res.set("Content-Type", application.resume.contentType);
        res.set("Content-Disposition", "inline; filename=resume.pdf");
        res.send(application.resume.data);
    } catch (err) {
        console.log("Error in getResume: ", err.message);
        if (err.name == "ResourceNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

const updateApplicationStatusController = async (req, res) => {
    const applicationId = req.params.id;
    const applicationData = req.body;
    const userId = req.user._id;
    try {
        const application = await findApplicationByIdService(applicationId);
        if (application.job.postedBy.toString() !== userId.toString()) {
            return res.status(403).json({ error: "Forbidden" });
        }
        // validate status
        if (
            !["Pending", "Accepted", "Rejected"].includes(
                applicationData.status
            )
        ) {
            return res.status(400).json({ error: "Invalid status" });
        }
        application.status = applicationData.status;
        await application.save();
        res.status(200).json(application);
    } catch (err) {
        console.log(
            "Error in updateApplicationStatusController: ",
            err.message
        );
        if (err.name == "ResourceNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

export { getApplication, getResume, updateApplicationStatusController };
