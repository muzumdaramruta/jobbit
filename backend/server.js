import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import cors from "cors";

dotenv.config();

connectDB();

const DOMAIN = process.env.DOMAIN || "localhost";
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000"; // Default CORS origin

const app = express();

// Set CORS headers using cors() middleware
app.use(
    cors({
        origin: CORS_ORIGIN,
        credentials: true,
    })
);

const server = http.createServer(app);

// server settings
app.use(express.json({ limit: "50mb" })); // To parse JSON data in the req.body
app.use(express.urlencoded({ extended: true })); // To parse form data in the req.body
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/applications", applicationRoutes);

app.listen(PORT, DOMAIN, () =>
    console.log(`Server running on ${DOMAIN}:${PORT}`)
);

export default app;