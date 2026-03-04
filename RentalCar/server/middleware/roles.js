export const requireRole =
  (...allowedRoles) =>
  (req, res, next) => {
    const role = req.user?.role;

    if (!role) {
      return res.status(401).json({ success: false, message: "not authorized" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "forbidden (insufficient role)",
      });
    }

    next();
  };