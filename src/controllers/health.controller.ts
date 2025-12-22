import type { Request, Response,  } from "express";
import { successResponse } from "../utils/api.response.js";
import { asyncHandler } from "../utils/async.handler.js";
import quicker from "../utils/quicker.js";

// Functional controllers
export const self = asyncHandler(async (_req: Request, res: Response) => {
  successResponse(res, "App is working", { status: "alive" });
});

export const health = asyncHandler(async (_req: Request, res: Response) => {
  const healthData = {
    application: quicker.getApplicationHealth(),
    system: quicker.getSystemHealth(),
    timestamp: Date.now(),
  };

  successResponse(res, "Health check success", healthData);
});
