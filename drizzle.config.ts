import { defineConfig } from "drizzle-kit";
import { env } from "./src/infra/config/env";

export default defineConfig({
  schema: "./src/infra/database/drizzle/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
