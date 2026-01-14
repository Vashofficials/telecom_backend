import { app } from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}...`);
    });
}

export default app;

// Optional test route
app.get("/", (req, res) => {
    res.send("<h1>Home route</h1>");
});
