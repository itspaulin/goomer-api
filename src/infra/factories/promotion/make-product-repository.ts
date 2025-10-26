import { DrizzleProductRepository } from "@/infra/database/drizzle/repositories/drizzle-product-repository";
import { ProductRepository } from "@/domain/application/repositories/product-repository";

export function makeProductRepository(): ProductRepository {
  return new DrizzleProductRepository();
}
