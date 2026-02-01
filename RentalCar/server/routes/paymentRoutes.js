import express from "express";
import { protect } from "../middleware/auth.js";
import { createPayment } from "../controllers/paymentController.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Payment
 *     description: Plaćanja rezervacija
 */

/**
 * @openapi
 * /api/payment:
 *   post:
 *     tags: [Payment]
 *     summary: Kreiranje plaćanja za rezervaciju
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePaymentRequest'
 *     responses:
 *       200:
 *         description: Plaćanje evidentirano
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/", protect, createPayment);

export default router;
