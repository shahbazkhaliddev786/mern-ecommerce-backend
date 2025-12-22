import type { Express } from "express";
import expressLoader from "./express.js";
import routesLoader from "./routes.js";

export default async function loaders({ app }: { app: Express }) {
  await expressLoader(app);
  console.log("Express Initialized");

  await routesLoader(app);
  console.log("Route Initialized");
}
