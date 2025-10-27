import { UpdatePromotionUseCase } from "@/domain/application/use-cases/update-promotion.use-case";
import { makePromotionRepository } from "../make-promotion-repository";
import { makeProductRepository } from "../make-product-repository";

export function makeUpdatePromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  const productRepository = makeProductRepository();
  return new UpdatePromotionUseCase(promotionRepository, productRepository);
}
