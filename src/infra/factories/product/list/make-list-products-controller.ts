import { ListProductsController } from "@/infra/http/controllers/list-products.controller";
import { makeListProductsUseCase } from "./make-list-products-use-case";

export function makeListProductsController() {
  const listProductUseCase = makeListProductsUseCase();
  return new ListProductsController(listProductUseCase);
}
