import Application from "../models/applicationModel.js";
import { ResourceNotFoundError } from "../errors/commonErrors.js";

const findApplicationByIdService = async (applicationId) => {
    const application = await Application.findById(applicationId)
        .populate("job")
        .exec();
    if (!application) {
        throw new ResourceNotFoundError("Application not found");
    }
    return application;
};

export { findApplicationByIdService };
