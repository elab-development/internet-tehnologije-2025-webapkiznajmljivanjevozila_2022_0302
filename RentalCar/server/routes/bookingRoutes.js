import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/bookingController.js";

import { protect } from "../middleware/auth.js";
import { canAccessBooking } from "../middleware/idor.js";

import { validateBody } from "../middleware/validate.js";
import { createBookingSchema, changeStatusSchema } from "../validators/bookingSchemas.js";

const bookingRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Booking
 *     description: Rezervacije i dostupnost
 */

bookingRouter.post("/check-availability", checkAvailabilityOfCar);

/**
 * @openapi
 * /api/booking/create:
 *   post:
 *     tags: [Booking]
 *     summary: Kreiranje rezervacije
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       200:
 *         description: Rezervacija kreirana
 */
bookingRouter.post(
  "/create",
  protect,
  validateBody(createBookingSchema),
  createBooking
);

bookingRouter.get("/user", protect, getUserBookings);

bookingRouter.get("/owner", protect, getOwnerBookings);

/**
 * @openapi
 * /api/booking/change-status:
 *   post:
 *     tags: [Booking]
 *     summary: Promena statusa rezervacije (owner/admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangeBookingStatusRequest'
 *     responses:
 *       200:
 *         description: Status promenjen
 */
bookingRouter.post(
  "/change-status",
  protect,
  validateBody(changeStatusSchema),
  canAccessBooking,
  changeBookingStatus
);

export default bookingRouter;
