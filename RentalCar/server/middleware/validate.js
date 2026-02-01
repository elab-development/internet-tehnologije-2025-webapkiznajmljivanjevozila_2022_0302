// server/middleware/validate.js
export const validateBody = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      });
    }

    // ✅ upišemo "validated" data nazad (sanitized)
    req.body = result.data;

    return next();
  } catch (err) {
    console.error("validateBody error:", err?.message);
    return res.status(500).json({
      success: false,
      message: "Validation middleware error",
    });
  }
};
