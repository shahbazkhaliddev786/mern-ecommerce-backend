import cors from "cors";
import express from "express";
import type { Express } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import globalErrorHandler from "../middlewares/global-error.handler.js";
import type { Request, Response } from "express";
import { fileURLToPath } from "url";
import { errorResponse } from "../utils/api.response.js";

// __dirname replacement in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function expressLoader(app: Express) {
  app.enable("trust-proxy");

//   // Security practices implemented:
//   // 1. Helmet to set various HTTP headers for security
//   // 2. CORS to allow cross-origin requests
//   // 3. Limiting request body size to prevent DOS attacks
//   // 4. Using cookie-parser to handle cookies securely
//   // 5. Morgan for logging HTTP requests
//   // 6. Validations on routes to ensure data 
//   // integrity and prevent injection attacks and XXS attacks

  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

  app.use(cors());
  app.use(express.json({ limit: "15kb" }));
  app.use(express.urlencoded({ extended: true, limit: "15kb" }));
  app.use(cookieParser());

  app.use(express.static(path.join(__dirname, "../public")));

  // 404 handler
  app.use((req: Request, res: Response) => {
    errorResponse(res, "Route not found", 404, {
      path: req.originalUrl,
      method: req.method,
    });
  });


  // Global error handler
  app.use(globalErrorHandler);
}

