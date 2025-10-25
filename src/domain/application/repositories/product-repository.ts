import { Product } from "@/domain/enterprise/entities/product";

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  update(id: string, product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
}
