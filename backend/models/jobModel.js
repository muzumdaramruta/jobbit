import mongoose from "mongoose";
import { Schema } from "mongoose";

const jobSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        applyLink: { type: String },
        requirements: { type: [String], default: [] },
        salary: { type: Number },
        datePosted: { type: Date, default: Date.now },
        deadline: { type: Date }, // maybe useless property
        jobType: {
            type: String,
            validate: {
                validator: function (value) {
                    return [
                        "Part-time",
                        "Full-time",
                        "Hybrid",
                        "Onsite",
                        "Remote",
                        "Internship",
                        "Freelance",
                        "Contract",
                        "Co-op",
                    ].includes(value);
                },
                message: (props) => `${props.value} is not a valid job type`,
            },
        },
        isOpen: { type: Boolean, default: true },
        postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
        acceptedApplication: {
            type: Schema.Types.ObjectId,
            ref: "Application",
            default: null,
        },
    },
    { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
