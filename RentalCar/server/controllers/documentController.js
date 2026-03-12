import imagekit from "../configs/imageKit.js";
import Document from "../models/Document.js";
import User from "../models/User.js";
import { getExtensionFromMime } from "../middleware/multer.js";
import logSecurityEvent from "../services/securityLogger.js";

const ALLOWED_DOCUMENT_TYPES = [
  "DRIVING_LICENSE",
  "ID_CARD",
  "PASSPORT",
  "OTHER",
];

export const uploadDocument = async (req, res) => {
  try {
    const userId = req.user._id;
    const { documentType } = req.body;

    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: "documentType is required",
      });
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid documentType",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    if (!imagekit) {
      return res.status(503).json({
        success: false,
        message: "Upload service is currently unavailable",
      });
    }

    const extension = getExtensionFromMime(req.file.mimetype) || ".pdf";

    const uploadRes = await imagekit.upload({
      file: req.file.buffer.toString("base64"),
      fileName: `doc_${userId}_${documentType}_${Date.now()}${extension}`,
      folder: "/documents",
    });

    const doc = await Document.create({
      user: userId,
      documentType,
      fileUrl: uploadRes.url,
    });

    await User.findByIdAndUpdate(userId, {
      $addToSet: { documents: doc._id },
    });

    await logSecurityEvent({
      event: "DOCUMENT_UPLOAD",
      userId: req.user?._id,
      req,
      status: 201,
      details: "Document uploaded"
    });
    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document: doc,
    });
  } catch (error) {
    console.error("uploadDocument error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload document",
    });
  }
};