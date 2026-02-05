import "dotenv/config";

import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

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

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(helmet());

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  try {
    const q = req.query; // pročitaj getter
    Object.defineProperty(req, "query", {
      value: { ...q },
      writable: true,
      configurable: true,
      enumerable: true,
    });
  } catch (e) {
    // ne ruši server ako ne uspe
  }
  next();
});

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200, // dev OK, u prod može 100
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use(
  mongoSanitize({
    replaceWith: "_",
    allowDots: false,
    onSanitize: ({ key }) => {
      console.warn(`Sanitized key: ${key}`);
    },
  }),
);

app.use(xss());

// Health
app.get("/", (req, res) => res.send("Server is running"));

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true }),
);

// Routes
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/cars", carRouter);
app.use("/api/document", documentRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/integrations", integrationsRouter);

app.use((err, req, res, next) => {
  if (err?.message === "Not allowed by CORS") {
    return res.status(403).json({ success: false, message: err.message });
  }
  console.error(err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
