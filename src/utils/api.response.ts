import type { Response } from "express";

export type ApiResponse<T = unknown> = {
  status: "success" | "error";
  message: string;
  data?: T;
  meta?: Record<string, unknown>;
};

/**
 * Send a standard API response
 * @param res Express Response object
 * @param statusCode HTTP status code
 * @param status "success" or "error"
 * @param message Response message
 * @param data Optional payload data
 * @param meta Optional metadata (pagination, extra info)
 */
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  status: "success" | "error",
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): void {
  const responseBody: ApiResponse<T> = { status, message };

  if (data !== undefined) responseBody.data = data;
  if (meta !== undefined) responseBody.meta = meta;

  res.status(statusCode).json(responseBody);
}

/**
 * Shortcut for success responses
 */
export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  meta?: Record<string, unknown>
): void {
  sendResponse(res, 200, "success", message, data, meta);
}

/**
 * Shortcut for error responses
 */
export function errorResponse<T>(
  res: Response,
  message: string,
  statusCode = 500,
  data?: T,
  meta?: Record<string, unknown>
): void {
  sendResponse(res, statusCode, "error", message, data, meta);
}
