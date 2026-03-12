import { logSecurityEvent } from "../services/securityLogger.js";

export const requireRole =
  (...allowedRoles) =>
  async (req, res, next) => {

    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ success: false, message: "not authorized" });
    }

    if (!allowedRoles.includes(role)) {

      await logSecurityEvent({
        event: "ACCESS_DENIED",
        userId: req.user?._id,
        req,
        status: 403,
        details: "RBAC role violation"
      });

      return res.status(403).json({
        success: false,
        message: "forbidden (insufficient role)",
      });
    }

    next();
  };