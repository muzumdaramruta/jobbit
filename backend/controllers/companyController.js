import {
    getAllCompanies,
    findCompanyById,
    createNewCompany,
    updateCompany,
    removeCompany,
    uploadPhotoService,
} from "../services/companyService.js";
import { isAdmin } from "../services/validation.js";
import multer from "multer";

// Set up multer for file upload

const upload = multer({
    storage: multer.memoryStorage(),
});

// get all companies
const getAllCompaniesController = async (req, res) => {
    try {
        let companies = await getAllCompanies();
        res.status(200).json(companies);
    } catch (err) {
        console.log("Error in getAllCompanies: ", err.message);
        return res.status(500).json({ error: err.message });
    }
};

const getCompany = async (req, res) => {
    const companyId = req.params.id;
    try {
        let company = await findCompanyById(companyId);

        res.status(200).json(company);
    } catch (err) {
        console.log("Error in getCompany: ", err.message);
        if (err.name == "CompanyNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// create a new company
const createCompanyController = async (req, res) => {
    const { name, description, location, industry } = req.body;
    try {
        // only admin can create company
        isAdmin(req);
        let company = await createNewCompany(
            name,
            description,
            location,
            industry
        );
        res.status(201).json(company);
    } catch (err) {
        if (err.name == "UnAuthorizedError") {
            return res.status(401).json({ error: err.message });
        }
        if (err.name == "CompanyInputError") {
            return res.status(400).json({ error: err.message });
        }
        if (err.name == "UserInputError") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// update company
const updateCompanyController = async (req, res) => {
    const companyId = req.params.id;
    const { name, description, location, industry } = req.body;
    try {
        // only admin can update company
        isAdmin(req);
        let company = await updateCompany(
            companyId,
            name,
            description,
            location,
            industry
        );
        res.status(200).json(company);
    } catch (err) {
        console.log("Error in updateCompany: ", err.message);
        if (err.name == "CompanyNotFoundError") {
            return res.status(404).json({ error: err.message });
        }
        if (err.name == "CompanyInputError") {
            return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
    }
};

// delete company
const deleteCompany = async (req, res) => {
    const companyId = req.params.id;
    try {
        // only admin can delete company
        isAdmin(req);
        let company = await removeCompany(companyId);
        res.status(200).json(company);
    } catch (err) {
        console.log("Error in deleteCompany: ", err.message);
        if (err.name == "CompanyNotFoundError") {
            return res.status(404).json({ error: "Company not found" });
        }
        return res.status(500).json({ error: err.message });
    }
};

const uploadPhoto = async (req, res) => {
    try {
        // Handle file uploads
        upload.array("photos", 10)(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.error("Error in uploadPhotos:", err);
                return res.status(400).json({ error: "File upload error" });
            } else if (err) {
                return res.status(500).json({ error: err.message });
            }
            const companyId = req.params.id;
            // check if company exists
            const company = await findCompanyById(companyId);
            if (!company) {
                return res.status(404).json({ error: "Company not found" });
            }

            // Check if files were uploaded
            if (!req.files || req.files.length === 0) {
                return res.status(400).json({ error: "Photos required" });
            }

            // Pass the files data to uploadPhotoService
            try {
                await Promise.all(
                    req.files.map(async (file) => {
                        await uploadPhotoService(req.user._id, companyId, file);
                    })
                );
                return res.status(200).json();
            } catch (error) {
                // Handle other errors
                console.error("Error when uploading photos:", error);
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
        console.error("Error in uploadPhotos:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export {
    getAllCompaniesController,
    getCompany,
    createCompanyController,
    updateCompanyController,
    deleteCompany,
    uploadPhoto,
};
