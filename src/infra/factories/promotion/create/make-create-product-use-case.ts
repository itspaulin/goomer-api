import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { makePromotionRepository } from "../make-promotion-repository";

export function makeCreatePromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  return new CreatePromotionUseCase(promotionRepository);
}
