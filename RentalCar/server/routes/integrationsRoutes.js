import express from "express";
import { getCountries, convert } from "../controllers/integrationsController.js";

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Integrations
 *     description: Eksterni servisi (countries, currency convert)
 */

/**
 * @openapi
 * /api/integrations/countries:
 *   get:
 *     tags: [Integrations]
 *     summary: Lista država (integracija)
 *     responses:
 *       200:
 *         description: Countries list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/countries", getCountries);

/**
 * @openapi
 * /api/integrations/currency/convert:
 *   get:
 *     tags: [Integrations]
 *     summary: Konverzija valute (integracija)
 *     parameters:
 *       - in: query
 *         name: from
 *         schema: { type: string, example: "EUR" }
 *         required: true
 *       - in: query
 *         name: to
 *         schema: { type: string, example: "RSD" }
 *         required: true
 *       - in: query
 *         name: amount
 *         schema: { type: number, example: 100 }
 *         required: true
 *     responses:
 *       200:
 *         description: Konvertovan iznos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get("/currency/convert", convert);

export default router;
