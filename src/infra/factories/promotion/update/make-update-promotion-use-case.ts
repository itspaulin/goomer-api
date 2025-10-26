import { UpdatePromotionUseCase } from "@/domain/application/use-cases/update-promotion.use-case";
import { makePromotionRepository } from "../make-promotion-repository";

export function makeUpdatePromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  return new UpdatePromotionUseCase(promotionRepository);
}
