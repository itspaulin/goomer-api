import { z } from "zod";

export const createPromotionBodySchema = z
  .object({
    product_id: z
      .number()
      .int()
      .positive("Product ID must be a positive integer"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(255, "Description must be 255 characters or less"),
    promotional_price: z
      .number()
      .positive("Promotional price must be positive"),
    days: z.array(z.string().min(1)).min(1, "At least one day is required"),
    start_time: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
    end_time: z
      .string()
      .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  })
  .strict();

export type CreatePromotionBody = z.infer<typeof createPromotionBodySchema>;

export const updatePromotionBodySchema = createPromotionBodySchema.partial();

export type UpdatePromotionBody = z.infer<typeof updatePromotionBodySchema>;
