import type { Request, Response, NextFunction } from "express";
import config from "../config/config.js";
import { EApplicationEnvironment } from "../constants/application.js";
import { rateLimiterMongo } from "../config/rate.limiter.js";
import { apiResponse } from "../utils/api.response.js";

export default async function rateLimiterMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Disable rate limiting in development
  if (config.ENV === EApplicationEnvironment.DEVELOPMENT) {
    return next();
  }

  if (!rateLimiterMongo) {
    return next();
  }

  try {
    await rateLimiterMongo.consume(req.ip as string, 1);
    return next();
  } catch {
    return apiResponse(res, 429, "error", "Too many requests", {
      ip: req.ip,
    });
  }
}
