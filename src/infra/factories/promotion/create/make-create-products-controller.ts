import { CreatePromotionController } from "@/infra/http/controllers/create-promotion.controller";
import { makeCreatePromotionUseCase } from "./make-create-product-use-case";

export function makeCreatePromotionsController() {
  const createPromotionUseCase = makeCreatePromotionUseCase();
  return new CreatePromotionController(createPromotionUseCase);
}
