import express from "express";
import { getCountries, convert } from "../controllers/integrationsController.js";

const router = express.Router();

router.get("/countries", getCountries);
router.get("/currency/convert", convert);

export default router;
