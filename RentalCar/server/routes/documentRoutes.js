import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { uploadDocument } from "../controllers/documentController.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", protect, upload.single("file"), uploadDocument);


export default router;
