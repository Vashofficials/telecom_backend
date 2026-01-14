import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Enable CORS for frontend
const defaultOrigins = [
    "https://you-pi.in",
    "https://www.you-pi.in",
    "http://localhost:5173",
    "http://localhost:3000",
    "https://telecom-backend-zk19.onrender.com"
];

const envOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]; // Merge and remove duplicates

console.log("Allowed Origins:", allowedOrigins); // Log for debugging

const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Explicitly handle OPTIONS requests for all routes to prevent 401s on preflight
app.options('*', cors(corsOptions));

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
