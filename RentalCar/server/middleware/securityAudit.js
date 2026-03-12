import logSecurityEvent from "../services/securityLogger.js";

export const securityAudit = async (req, res, next) => {
  try {

    await logSecurityEvent({
      event: "REQUEST_AUDIT",
      userId: req.user?._id,
      req,
      status: 200,
      details: "API request"
    });

  } catch (error) {
    console.error("Security audit error:", error);
  }

  next();
};