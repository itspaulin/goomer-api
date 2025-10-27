import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { makePromotionRepository } from "../make-promotion-repository";
import { makeProductRepository } from "../make-product-repository";

export function makeCreatePromotionUseCase() {
  const promotionRepository = makePromotionRepository();
  const productRepository = makeProductRepository();
  return new CreatePromotionUseCase(promotionRepository, productRepository);
}
