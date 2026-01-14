import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for frontend
// Enable CORS for frontend
const defaultOrigins = [
    "https://you-pi.in",
    "https://you-pi.in/",
    "https://www.you-pi.in",
    "https://www.you-pi.in/",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
];

const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]; // Merge and remove duplicates

console.log("Allowed Origins:", allowedOrigins); // Log for debugging

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
}));

// Parse JSON and URL-encoded requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route imports
import { userContactRouter } from "./routes/userContact.route";
import { userWaitlistRouter } from "./routes/userWaitlist.route";

// Health Check Route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running successfully",
        timestamp: new Date().toISOString()
    });
});

// Use routes
app.use("/api/v1", userContactRouter);
app.use("/api/v1", userWaitlistRouter);

export { app };
