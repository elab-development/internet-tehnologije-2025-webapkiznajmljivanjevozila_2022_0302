import express from "express";
import { protect } from "../middleware/auth.js";
import { createPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", protect, createPayment); 

export default router;
