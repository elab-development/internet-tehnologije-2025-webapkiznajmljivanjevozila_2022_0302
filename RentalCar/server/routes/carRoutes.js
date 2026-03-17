import express from "express";
import { getAllCars, getAvailableCars } from "../controllers/carController.js";

const carRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Cars
 *     description: Public pregled vozila
 */

/**
 * @openapi
 * /api/cars:
 *   get:
 *     tags: [Cars]
 *     summary: Svi automobili (svih ownera)
 *     responses:
 *       200:
 *         description: Lista automobila
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */
carRouter.get("/", getAllCars);

/**
 * @openapi
 * /api/cars/available:
 *   get:
 *     tags: [Cars]
 *     summary: Dostupni automobili po datumu i lokaciji
 *     parameters:
 *       - in: query
 *         name: pickupDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Datum preuzimanja vozila
 *       - in: query
 *         name: returnDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Datum vraćanja vozila
 *       - in: query
 *         name: pickupLocation
 *         schema:
 *           type: string
 *         required: false
 *         description: Lokacija preuzimanja
 *     responses:
 *       200:
 *         description: Lista dostupnih automobila
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 cars:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Car'
 */
carRouter.get("/available", getAvailableCars);

export default carRouter;