import { CreateProductController } from "@/infra/http/controllers/create-product.controller";
import { makeCreateProductUseCase } from "./make-create-product-use-case";

export function makeProductsController() {
  const createProductUseCase = makeCreateProductUseCase();
  return new CreateProductController(createProductUseCase);
}
