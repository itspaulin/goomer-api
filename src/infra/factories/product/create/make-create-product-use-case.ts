import { ProductRepository } from "@/domain/application/repositories/product-repository";
import { CreateProductUseCase } from "@/domain/application/use-cases/create-product.use-case";
import { DrizzleProductRepository } from "@/infra/database/drizzle/repositories/drizzle-product-repository";

export function makeCreateProductUseCase(repository?: ProductRepository) {
  const productRepository = repository ?? new DrizzleProductRepository();
  return new CreateProductUseCase(productRepository);
}
