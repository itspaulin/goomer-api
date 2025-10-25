import { config } from "dotenv";
import z from "zod";

config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  PORT: z.coerce.number().positive().default(3000),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
