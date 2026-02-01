import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadDocument } from "../controllers/documentController.js";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @openapi
 * tags:
 *   - name: Document
 *     description: Upload dokumenata korisnika
 */

/**
 * @openapi
 * /api/document/upload:
 *   post:
 *     tags: [Document]
 *     summary: Upload dokumenta (PDF/JPG/PNG) - multipart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *                 example: "DRIVERS_LICENSE"
 *     responses:
 *       200:
 *         description: Dokument uploadovan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DocumentUploadResponse'
 */
router.post("/upload", protect, upload.single("file"), uploadDocument);

export default router;
