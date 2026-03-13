import express from "express";
import { protect } from "../middleware/auth.js";
import {
  applyUpload,
  imageUpload,
  ensureFilePresent,
  ensureImageKitConfigured,
} from "../middleware/multer.js";
import { requireRole } from "../middleware/roles.js";
import { getSecurityLogs } from "../controllers/adminSecurityController.js";

import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  getOwnerStats,
  toggleCarAvailability,
  updateUserImage,
} from "../controllers/ownerController.js";

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
 *     description: >
 *       Backend očekuje multipart/form-data sa poljima:
 *       - image (file)
 *       - carData (string) -> JSON string sa podacima o autu (brand, model, pricePerDay, itd.)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image, carData]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               carData:
 *                 type: string
 *                 description: JSON string (npr. {"brand":"BMW","model":"X5","pricePerDay":80,"location":"New York"})
 *     responses:
 *       200:
 *         description: Auto dodat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post(
  "/add-car",
  protect,
  requireRole("owner", "admin"),
  ensureImageKitConfigured,
  applyUpload(imageUpload.single("image")),
  ensureFilePresent("image"),
  addCar
);

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
ownerRouter.get(
  "/cars",
  protect,
  requireRole("owner", "admin"),
  getOwnerCars
);
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
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dostupnost promenjena
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post(
  "/toggle-car",
  protect,
  requireRole("owner", "admin"),
  toggleCarAvailability
);
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
 *             required: [carId]
 *             properties:
 *               carId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auto obrisan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.post(
  "/delete-car",
  protect,
  requireRole("owner", "admin"),
  deleteCar
);
/**
 * @openapi
 * /api/owner/dashboard:
 *   get:
 *     tags: [Owner]
 *     summary: Owner dashboard podaci (KPI + recent + monthlyRevenue)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard podaci
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.get(
  "/dashboard",
  protect,
  requireRole("owner", "admin"),
  getDashboardData
);
/**
 * @openapi
 * /api/owner/stats:
 *   get:
 *     tags: [Owner]
 *     summary: Podaci za grafikone (rezervacije po mesecima, prihod, statusi, top cars)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema:
 *           type: integer
 *         description: Godina za agregaciju (default = trenutna)
 *     responses:
 *       200:
 *         description: Stats za dashboard
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.get(
  "/stats",
  protect,
  requireRole("owner", "admin"),
  getOwnerStats
);
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
 *             required: [image]
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
ownerRouter.post(
  "/update-image",
  protect,
  requireRole("owner", "admin"),
  ensureImageKitConfigured,
  applyUpload(imageUpload.single("image")),
  ensureFilePresent("image"),
  updateUserImage
);

/**
 * @openapi
 * /api/owner/security-logs:
 *   get:
 *     tags: [Owner]
 *     summary: Pregled security logova (admin)
 *     description: Admin može pregledati sve security događaje (login success, login fail, request audit).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *         description: Filter po tipu događaja (npr. LOGIN_FAILED)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Broj logova (default 50)
 *     responses:
 *       200:
 *         description: Lista security logova
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
ownerRouter.get(
  "/security-logs",
  protect,
  requireRole("owner", "admin"),
  getSecurityLogs
);
export default ownerRouter;
