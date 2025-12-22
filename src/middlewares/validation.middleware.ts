import type { Request, Response, NextFunction } from 'express';
import { validationResult, type ValidationError } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err: ValidationError) => {
      // Only field errors have path/value/location
      if (err.type === 'field') {
        return {
          field: err.path,
          message: err.msg,
          value: err.value,
          location: err.location, // 'body' | 'query' | 'params' | etc.
        };
      }

      // For alternative, unknown_fields, etc. — fallback
      return {
        message: err.msg,
        // No field/value/location available
      };
    });

    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: formattedErrors,
    });
  }

  next();
};