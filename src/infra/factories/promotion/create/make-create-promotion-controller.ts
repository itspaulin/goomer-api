import { CreatePromotionController } from "@/infra/http/controllers/create-promotion.controller";
import { makeCreatePromotionUseCase } from "./make-create-promotion-use-case";

export function makeCreatePromotionsController() {
  const createPromotionUseCase = makeCreatePromotionUseCase();
  return new CreatePromotionController(createPromotionUseCase);
}
