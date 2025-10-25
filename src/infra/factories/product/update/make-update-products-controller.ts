import { makeUpdateProductUseCase } from "./make-update-products-use-case";
import { UpdateProductController } from "@/infra/http/controllers/update-product.controller";

export function makeUpdateProductsController() {
  const updateProductUseCase = makeUpdateProductUseCase();
  return new UpdateProductController(updateProductUseCase);
}
