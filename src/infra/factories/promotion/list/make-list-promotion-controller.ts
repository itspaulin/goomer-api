import { ListPromotionsController } from "@/infra/http/controllers/list-promotions.controller";
import { makeListPromotionUseCase } from "./make-list-promotion-use-case";

export function makeListPromotionController() {
  const listProductUseCase = makeListPromotionUseCase();
  return new ListPromotionsController(listProductUseCase);
}
