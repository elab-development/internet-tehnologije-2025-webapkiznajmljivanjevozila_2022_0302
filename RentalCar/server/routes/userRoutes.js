import express from "express";
import {
  getCars,
  getUserData,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

/**
 * @openapi
 * tags:
 *   - name: User
 *     description: Auth i user operacije
 */

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     tags: [User]
 *     summary: Registracija korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Uspešna registracija
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
userRouter.post("/register", registerUser);

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     tags: [User]
 *     summary: Login korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Uspešan login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
userRouter.post("/login", loginUser);

/**
 * @openapi
 * /api/user/data:
 *   get:
 *     tags: [User]
 *     summary: Podaci o ulogovanom korisniku
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
userRouter.get("/data", protect, getUserData);

/**
 * @openapi
 * /api/user/cars:
 *   get:
 *     tags: [User]
 *     summary: Lista automobila (user view)
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
userRouter.get("/cars", getCars);

export default userRouter;
