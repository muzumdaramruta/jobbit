import mongoose from "mongoose";
import { Schema } from "mongoose";

const companySchema = new Schema(
    {
        name: { type: String, required: true },
        industry: { type: String, required: true },
        location: { type: String, required: true },
        website: { type: String },
        description: { type: String },
        logoUrl: { type: String },
        rating: { type: Number },
        reviews: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Review",
                },
            ],
            default: [],
        },
        founded: { type: Date },
        size: { type: Number },
        photos: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Photo",
                },
            ],
            default: [],
        },
    },
    { timestamps: true }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
