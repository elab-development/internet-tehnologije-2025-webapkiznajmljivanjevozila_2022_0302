import express from "express";
import { protect } from "../middleware/auth.js";
import { uploadDocument } from "../controllers/documentController.js";
import {
  applyUpload,
  documentUpload,
  ensureFilePresent,
  ensureImageKitConfigured,
} from "../middleware/multer.js";

const router = express.Router();

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
 *     summary: Upload dokumenta (samo PDF) - multipart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, documentType]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF dokument, maksimalno 5MB
 *               documentType:
 *                 type: string
 *                 enum: [DRIVING_LICENSE, ID_CARD, PASSPORT, OTHER]
 *     responses:
 *       200:
 *         description: Dokument uploadovan
 *       400:
 *         description: Neispravan dokument ili neispravan request
 *       413:
 *         description: Fajl je prevelik
 *       503:
 *         description: Upload servis nije dostupan
 */
router.post(
  "/upload",
  protect,
  ensureImageKitConfigured,
  applyUpload(documentUpload.single("file")),
  ensureFilePresent("file"),
  uploadDocument
);

export default router;