import { UpdateProductUseCase } from "@/domain/application/use-cases/update-product.use-case";
import { makeProductRepository } from "../make-product-repository";

export function makeUpdateProductUseCase() {
  const productRepository = makeProductRepository();
  return new UpdateProductUseCase(productRepository);
}
