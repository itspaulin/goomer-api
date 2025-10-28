import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.config";
import { routes } from "./routes";
import { env } from "@/infra/config/env";

const app = express();

app.use(express.json());

// Swagger sempre disponível (ou apenas em dev/staging)
if (env.NODE_ENV !== "production" || env.ENABLE_DOCS === "true") {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerSpec));
}

app.use(routes);

export { app };
