import mongoose from "mongoose";
import { Schema } from "mongoose";

const applicationSchema = new Schema(
    {
        job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
        resume: { data: Buffer, contentType: String },
        coverLetter: { type: String },
        dateApplied: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
