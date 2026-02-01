import express from "express";
import { getAllCars } from "../controllers/carController.js";

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

export default carRouter;
