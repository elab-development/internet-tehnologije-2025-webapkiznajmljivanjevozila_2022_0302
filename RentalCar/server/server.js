import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./config/db.js";

// Initialize Express App
const app = express();

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"));
app.use('/api/user', userRouter)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
