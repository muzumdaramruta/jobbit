import mongoose from "mongoose";
import { Schema } from "mongoose";

const photoSchema = new Schema(
    {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true },
        caption: { type: String },
        description: { type: String },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

const Photo = mongoose.model("Photo", photoSchema);

export default Photo;
