import { DeletePromotionController } from "@/infra/http/controllers/delete-promotion.controller";
import { makeDeletePromotionUseCase } from "../../promotion/delete/make-delete-promotion-use-case";

export function makeDeletePromotionsController() {
  const deletePromotionUseCase = makeDeletePromotionUseCase();
  return new DeletePromotionController(deletePromotionUseCase);
}
