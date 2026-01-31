import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }

    // ✅ podržava i "Bearer <token>" i "<token>"
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ podržava payload kao string ili objekt (id/userId/_id)
    const userId =
      typeof decoded === "string"
        ? decoded
        : decoded?.id || decoded?.userId || decoded?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "not authorized",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "not authorized",
    });
  }
};
