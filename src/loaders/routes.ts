
import type { Express } from "express";
import exprese from "express";
import { handleStripeWebhook } from "../services/order.service.js";
import logger from "../utils/logger.js";

import {
  healthRouter,
  brandRouter,
  categoryRouter,
  productRouter,
  authRouter,
  cartRouter
} from "../routes/index.js";
import orderRouter from "../routes/order.routes.js";

export default async function routesLoader(app: Express) {
  // Root endpoint
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to the API" });
  });

  // API versioned routes
  app.use("/api/v1", healthRouter); 
  app.use("/api/v1/brands", brandRouter); 
  app.use("/api/v1/categories", categoryRouter); 
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/auth", authRouter);
  app.use('/api/v1/cart', cartRouter);
  app.use("/api/v1/orders", orderRouter);

  // Auth routes can be used like this when ready
  // app.use("/api/v1/auth", await (await import("../routes/auth.routes.js")).authRouter);

  // Optional: 404 handler for undefined API routes
  app.use("/api/v1", (_, res) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  });
}
