import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface MakePromotionOptions {
  product_id?: number;
  description?: string;
  promotional_price?: number;
  days?: string[];
  start_time?: string;
  end_time?: string;
  id?: string;
}

export function makePromotion(options: MakePromotionOptions = {}): Promotion {
  return Promotion.create(
    {
      product_id: options.product_id ?? 1,
      description: options.description ?? "Happy Hour - 50% off",
      promotional_price: options.promotional_price ?? 22.95,
      days: options.days ?? ["monday", "wednesday", "friday"],
      start_time: options.start_time ?? "18:00",
      end_time: options.end_time ?? "20:00",
      created_at: new Date(),
      updated_at: new Date(),
    },
    options.id ? new UniqueEntityId(options.id) : undefined
  );
}
