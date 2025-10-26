import { makeUpdatePromotionUseCase } from "./make-update-promotion-use-case";
import { UpdatePromotionController } from "@/infra/http/controllers/update-promotion.controller";

export function makeUpdatePromotionsController() {
  const updatePromotionUseCase = makeUpdatePromotionUseCase();
  return new UpdatePromotionController(updatePromotionUseCase);
}
