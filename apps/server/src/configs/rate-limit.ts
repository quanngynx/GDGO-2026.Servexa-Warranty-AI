import rateLimit from "express-rate-limit";

/** Rate limit for public liveness and API-key-protected root/deep-health routes. */
export const publicRoutesRateLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
