import { ListPromotionsUseCase } from "@/domain/application/use-cases/list-promotions.use-case";
import { makePromotionRepository } from "../make-promotion-repository";

export function makeListPromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  return new ListPromotionsUseCase(promotionRepository);
}
