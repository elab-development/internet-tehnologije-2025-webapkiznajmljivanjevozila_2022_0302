import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
});