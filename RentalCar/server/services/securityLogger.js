import SecurityLog from "../models/SecurityLog.js";

export const logSecurityEvent = async ({
  event,
  userId = null,
  req = null,
  status = null,
  details = null
}) => {
  try {
    await SecurityLog.create({
      event,
      user: userId,
      ip: req?.ip || null,
      path: req?.originalUrl || null,
      method: req?.method || null,
      status,
      details
    });
  } catch (err) {
    console.error("Security log failed:", err.message);
  }
};