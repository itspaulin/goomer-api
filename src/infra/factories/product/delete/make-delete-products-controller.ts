import { DeleteProductController } from "@/infra/http/controllers/delete-product.controller";
import { makeDeleteProductUseCase } from "./make-delete-product-use-case";

export function makeDeleteProductsController() {
  const deleteProductUseCase = makeDeleteProductUseCase();
  return new DeleteProductController(deleteProductUseCase);
}
