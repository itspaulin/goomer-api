import { DeleteProductUseCase } from "@/domain/application/use-cases/delete-product.use-case";
import { makeProductRepository } from "../make-product-repository";

export function makeDeleteProductUseCase() {
  const productRepository = makeProductRepository();
  return new DeleteProductUseCase(productRepository);
}
