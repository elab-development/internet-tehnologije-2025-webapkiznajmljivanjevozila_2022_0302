import "dotenv/config";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import connectDB from "./configs/db.js";
import { swaggerSpec } from "./configs/swagger.js";

import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import carRouter from "./routes/carRoutes.js";
import documentRouter from "./routes/documentRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import integrationsRouter from "./routes/integrationsRoutes.js";

// Initialize Express App
const app = express();

// Connect to Database
await connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health
app.get("/", (req, res) => res.send("Server is running"));

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

// Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/cars", carRouter);
app.use("/api/document", documentRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/integrations", integrationsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
