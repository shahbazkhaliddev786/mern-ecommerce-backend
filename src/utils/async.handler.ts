import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async controller function and automatically
 * passes errors to next() (global error handler)
 *
 * @param fn - Async controller function
 * @returns Express RequestHandler
 */

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
