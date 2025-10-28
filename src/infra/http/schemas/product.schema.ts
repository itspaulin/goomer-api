import { z } from "zod";

export const PRODUCT_CATEGORIES = [
  "Entradas",
  "Pratos principais",
  "Sobremesas",
  "Bebidas",
] as const;

export const createProductBodySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or less"),
  price: z.number().positive("Price must be positive"),
  category: z.enum(PRODUCT_CATEGORIES, {
    message: "Invalid category",
  }),
  visible: z.boolean().default(true),
  order: z.number().int().nonnegative("Order must be non-negative").optional(),
});

export type CreateProductBody = z.infer<typeof createProductBodySchema>;

export const updateProductBodySchema = createProductBodySchema.partial();

export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;
