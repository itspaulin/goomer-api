import { makeShowProductUseCase } from "./make-show-products-use-case";
import { ShowProductController } from "@/infra/http/controllers/show-product.controller";

export function makeShowProductsController() {
  const showProductUseCase = makeShowProductUseCase();
  return new ShowProductController(showProductUseCase);
}
