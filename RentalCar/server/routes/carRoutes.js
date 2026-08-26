import express from "express";
import { getAllCars, getCarById } from "../controllers/carController.js";

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
 * /api/cars/{id}:
 *   get:
 *     tags: [Cars]
 *     summary: Jedan auto po ID-u
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto
 *       404:
 *         description: Auto nije pronađen
 */
carRouter.get("/:id", getCarById);

export default carRouter;
