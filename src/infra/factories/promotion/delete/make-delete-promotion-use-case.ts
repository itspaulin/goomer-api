import { DeletePromotionUseCase } from "@/domain/application/use-cases/delete-promotion.use-case";
import { makePromotionRepository } from "../make-promotion-repository";

export function makeDeletePromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  return new DeletePromotionUseCase(promotionRepository);
}
