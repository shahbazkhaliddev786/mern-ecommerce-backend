// src/loaders/routes.loader.ts (or wherever your route loader lives)

import type { Express } from "express";

import {
  healthRouter,
  brandRouter,
  categoryRouter,
  productRouter
} from "../routes/index.js";

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

  // Optional: 404 handler for undefined API routes
  app.use("/api/v1", (_, res) => {
    res.status(404).json({
      status: "error",
      message: "Route not found",
    });
  });
}