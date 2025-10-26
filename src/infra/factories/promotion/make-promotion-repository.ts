import { DrizzlePromotionRepository } from "@/infra/database/drizzle/repositories/drizzle-promotion-repository";
import { PromotionRepository } from "@/domain/application/repositories/promotion-repository";

export function makePromotionRepository(): PromotionRepository {
  return new DrizzlePromotionRepository();
}
