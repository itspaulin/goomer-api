import { config } from "dotenv";
import z from "zod";

config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z.coerce.number().positive().default(3333),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  ENABLE_DOCS: z.string().optional().default("true"),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
