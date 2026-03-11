import multer from "multer";
import path from "path";
import imagekit from "../configs/imageKit.js";

const storage = multer.memoryStorage();

const ALLOWED_DOCUMENT_MIME_TYPES = ["application/pdf"];
const ALLOWED_DOCUMENT_EXTENSIONS = [".pdf"];

const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const createFileFilter = ({
  allowedMimeTypes,
  allowedExtensions,
  fileLabel,
}) => {
  return (req, file, cb) => {
    const mimeType = (file.mimetype || "").toLowerCase();
    const extension = path.extname(file.originalname || "").toLowerCase();

    const isMimeAllowed = allowedMimeTypes.includes(mimeType);
    const isExtensionAllowed = allowedExtensions.includes(extension);

    if (!isMimeAllowed || !isExtensionAllowed) {
      const error = new Error(
        `Invalid ${fileLabel} type. Allowed: ${allowedExtensions.join(", ")}`
      );
      error.statusCode = 400;
      error.code = "INVALID_FILE_TYPE";
      return cb(error);
    }

    cb(null, true);
  };
};

const createMemoryUpload = ({ maxFileSize, allowedMimeTypes, allowedExtensions, fileLabel }) =>
  multer({
    storage,
    limits: { fileSize: maxFileSize },
    fileFilter: createFileFilter({
      allowedMimeTypes,
      allowedExtensions,
      fileLabel,
    }),
  });

export const documentUpload = createMemoryUpload({
  maxFileSize: MAX_DOCUMENT_SIZE,
  allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
  allowedExtensions: ALLOWED_DOCUMENT_EXTENSIONS,
  fileLabel: "document",
});

export const imageUpload = createMemoryUpload({
  maxFileSize: MAX_IMAGE_SIZE,
  allowedMimeTypes: ALLOWED_IMAGE_MIME_TYPES,
  allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
  fileLabel: "image",
});

export const applyUpload = (multerMiddleware) => {
  return (req, res, next) => {
    multerMiddleware(req, res, (err) => {
      if (!err) return next();

      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(413).json({
            success: false,
            message: "File too large. Maximum allowed size is 5MB.",
          });
        }

        return res.status(400).json({
          success: false,
          message: err.message || "Upload error",
        });
      }

      const statusCode = err.statusCode || 400;
      return res.status(statusCode).json({
        success: false,
        message: err.message || "Invalid upload",
      });
    });
  };
};

export const ensureFilePresent = (fieldName = "file") => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: `Missing required file field: ${fieldName}`,
      });
    }
    next();
  };
};

export const ensureImageKitConfigured = (req, res, next) => {
  if (!imagekit) {
    return res.status(503).json({
      success: false,
      message: "Upload service is currently unavailable",
    });
  }
  next();
};

export const getExtensionFromMime = (mimeType = "") => {
  const normalized = mimeType.toLowerCase();

  switch (normalized) {
    case "application/pdf":
      return ".pdf";
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    default:
      return "";
  }
};