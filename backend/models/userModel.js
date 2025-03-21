import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            minLength: 6,
            required: true,
        },
        phone: {
            type: String,
            match: /^[0-9]{10}$/,
        },
        address: {
            type: String,
            default: "",
        },
        profilePic: {
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
        isFrozen: {
            type: Boolean,
            default: false,
        },
        userRole: {
            type: String,
            validate: {
                validator: function (value) {
                    return ["Employer", "Employee", "Admin"].includes(value);
                },
                message: (props) => `${props.value} is not a valid user role`,
            },
            required: true,
        },
        postedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
        savedJobs: [{ type: Schema.Types.ObjectId, ref: "Job" }],
        applications: [{ type: Schema.Types.ObjectId, ref: "Application" }],
        company: { type: Schema.Types.ObjectId, ref: "Company" },
        job: { type: Schema.Types.ObjectId, ref: "Job" },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;
