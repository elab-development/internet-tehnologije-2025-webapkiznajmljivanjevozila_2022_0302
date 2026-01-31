import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  getOwnerBookings,
  getUserBookings,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Booking
 *     description: Rezervacije i dostupnost
 */

/**
 * @openapi
 * /api/booking/check-availability:
 *   post:
 *     tags: [Booking]
 *     summary: Provera dostupnosti vozila u periodu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AvailabilityRequest'
 *     responses:
 *       200:
 *         description: Dostupnost
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
bookingRouter.post("/create", protect, createBooking);

/**
 * @openapi
 * /api/booking/user:
 *   get:
 *     tags: [Booking]
 *     summary: Rezervacije ulogovanog korisnika
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista rezervacija korisnika
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
bookingRouter.get("/user", protect, getUserBookings);

/**
 * @openapi
 * /api/booking/owner:
 *   get:
 *     tags: [Booking]
 *     summary: Rezervacije owner-a (samo njegove)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista rezervacija za owner vozila
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
bookingRouter.get("/owner", protect, getOwnerBookings);

/**
 * @openapi
 * /api/booking/change-status:
 *   post:
 *     tags: [Booking]
 *     summary: Promena statusa rezervacije (npr. owner/admin)
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
bookingRouter.post("/change-status", protect, changeBookingStatus);

export default bookingRouter;
