import { ListProductsUseCase } from "@/domain/application/use-cases/list-products.use-case";
import { makeProductRepository } from "./make-product-repository";

export function makeListProductsUseCase() {
  const productRepository = makeProductRepository();
  return new ListProductsUseCase(productRepository);
}
