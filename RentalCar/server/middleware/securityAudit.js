import { logSecurityEvent } from "../services/securityLogger.js";

export const securityAudit = async (req, res, next) => {
  try {
    await logSecurityEvent({
      event: "REQUEST_AUDIT",
      userId: req.user?._id || null,
      req,
      status: 200,
      details: "API request"
    });
  } catch (err) {
    console.error("Audit log failed:", err.message);
  }

  next();
};