import { CreateProductUseCase } from "@/domain/application/use-cases/create-product.use-case";
import { makeProductRepository } from "./make-product-repository";

export function makeCreateProductUseCase() {
  const productRepository = makeProductRepository();
  return new CreateProductUseCase(productRepository);
}
