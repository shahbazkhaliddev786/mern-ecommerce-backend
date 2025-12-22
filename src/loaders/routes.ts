import type { Express } from "express";
import healthRouter from "../routes/health.routes.js";

export default async function routesLoader(app: Express) {
  app.get("/", (_, res) => {
    res.json({ message: "Welcome to the API" });
  });

  app.use("/api/v1", healthRouter);
}
