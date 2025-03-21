import mongoose from "mongoose";
import {
    CompanyInputError,
    CompanyNotFoundError,
} from "../errors/companyErrors.js";
import {
    createCompany,
    findCompanyDetailsById,
    deleteCompany,
    updateCompanyDetails,
} from "../db/companyRepository.js";
import Company from "../models/companyModel.js";
import Photo from "../models/photoModel.js";

const getAllCompanies = async () => {
    return await Company.find({});
};

const findCompanyById = async (companyId) => {
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
        throw new CompanyInputError("Invalid company id");
    }
    const company = await findCompanyDetailsById(companyId);
    if (!company) {
        throw new CompanyNotFoundError();
    }
    return company;
};

const createNewCompany = async (name, description, location, industry) => {
    if (!name || !description || !location || !industry) {
        throw new CompanyInputError(
            "One or more missing fields: name, description, location, industry"
        );
    }
    const newCompany = new Company({
        name,
        description,
        location,
        industry,
    });
    await createCompany(newCompany);
    return newCompany;
};

const updateCompany = async (
    companyId,
    name,
    description,
    location,
    industry
) => {
    // const updatedCompany = await updateCompanyDetails(
    //     companyId,
    //     name,
    //     description,
    //     location,
    //     industry
    // );
    // return updatedCompany;

    // retrieve company details and throw error if not found
    const company = await findCompanyById(companyId);
    // update company details only if the fields are not empty
    if (name) {
        company.name = name;
    }
    if (description) {
        company.description = description;
    }
    if (location) {
        company.location = location;
    }
    if (industry) {
        company.industry = industry;
    }
    await company.save();
    return company;
};

const removeCompany = async (companyId) => {
    const company = await findCompanyById(companyId);
    await deleteCompany(company);
};

const uploadPhotoService = async (userId, companyId, photoFile) => {
    const company = await findCompanyById(companyId);
    const photo = new Photo({
        data: photoFile.buffer,
        contentType: photoFile.mimetype,
        uploadedBy: userId,
    });
    await photo.save();
    if (!company.photos) {
        company.photos = [];
    }
    company.photos.push(photo);
    await company.save();
};

export {
    getAllCompanies,
    findCompanyById,
    createNewCompany,
    updateCompany,
    removeCompany,
    uploadPhotoService,
};
