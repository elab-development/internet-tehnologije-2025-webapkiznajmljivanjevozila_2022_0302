import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";
import upload from "../middleware/multer.js";

const ownerRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Owner
 *     description: Owner operacije (vozila, dashboard, profilna slika)
 */

/**
 * @openapi
 * /api/owner/change-role:
 *   post:
 *     tags: [Owner]
 *     summary: Promena role u owner
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Role promenjena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post("/change-role", protect, changeRoleToOwner);

/**
 * @openapi
 * /api/owner/add-car:
 *   post:
 *     tags: [Owner]
 *     summary: Dodavanje automobila (multipart sa slikom)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               pricePerDay:
 *                 type: number
 *     responses:
 *       200:
 *         description: Auto dodat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post("/add-car", protect, upload.single("image"), addCar);

/**
 * @openapi
 * /api/owner/cars:
 *   get:
 *     tags: [Owner]
 *     summary: Lista automobila owner-a
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner cars
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.get("/cars", protect, getOwnerCars);

/**
 * @openapi
 * /api/owner/toggle-car:
 *   post:
 *     tags: [Owner]
 *     summary: Toggle dostupnosti auta
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carId: { type: string }
 *     responses:
 *       200:
 *         description: Dostupnost promenjena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);

/**
 * @openapi
 * /api/owner/delete-car:
 *   post:
 *     tags: [Owner]
 *     summary: Brisanje automobila
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carId: { type: string }
 *     responses:
 *       200:
 *         description: Auto obrisan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post("/delete-car", protect, deleteCar);

/**
 * @openapi
 * /api/owner/dashboard:
 *   get:
 *     tags: [Owner]
 *     summary: Owner dashboard podaci
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.get("/dashboard", protect, getDashboardData);

/**
 * @openapi
 * /api/owner/update-image:
 *   post:
 *     tags: [Owner]
 *     summary: Update profilne slike korisnika (multipart)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Slika ažurirana
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post("/update-image", protect, upload.single("image"), updateUserImage);

export default ownerRouter;
