import { ShowProductUseCase } from "@/domain/application/use-cases/show-product.use-case";
import { makeProductRepository } from "../make-product-repository";

export function makeShowProductUseCase() {
  const productRepository = makeProductRepository();
  return new ShowProductUseCase(productRepository);
}
