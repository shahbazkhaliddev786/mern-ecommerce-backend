import type { Request, Response, NextFunction } from "express";
import config from "../config/config.js";
import { EApplicationEnvironment } from "../constants/application.js";
import { rateLimiterMongo } from "../config/rate.limiter.js";
import { errorResponse } from "../utils/api.response.js";

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
    return errorResponse(res, "Too many requests", 429, {
      ip: req.ip,
    });
  }
}
