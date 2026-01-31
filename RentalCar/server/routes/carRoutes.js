import express from "express";
import { getAllCars } from "../controllers/carController.js";

const carRouter = express.Router();

// PUBLIC: svi automobili (svih ownera)
carRouter.get("/", getAllCars);

export default carRouter;