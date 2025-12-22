import type { Request, Response } from "express";
import { asyncHandler } from "../utils/async.handler.js";
import { apiResponse } from "../utils/api.response.js";
import quicker from "../utils/quicker.js";

// Self health check
export const self = asyncHandler(async (_req: Request, res: Response) => {
  return apiResponse(res, 200, "success", "App is working", { status: "alive" });
});

// Full health check
export const health = asyncHandler(async (_req: Request, res: Response) => {
  const healthData = {
    application: quicker.getApplicationHealth(),
    system: quicker.getSystemHealth(),
    timestamp: Date.now(),
  };

  return apiResponse(res, 200, "success", "Health check success", healthData);
});
