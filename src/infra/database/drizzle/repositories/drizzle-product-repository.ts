import { ProductRepository } from "@/domain/application/repositories/product-repository";
import { Product } from "@/domain/enterprise/entities/product";
import { eq } from "drizzle-orm";
import { products } from "../../drizzle/schemas/products";
import { db } from "../../index";
import { DrizzleProductMapper } from "../mappers/drizzle-product.mapper";

export class DrizzleProductRepository implements ProductRepository {
  async create(product: Product): Promise<Product> {
    const [created] = await db
      .insert(products)
      .values(DrizzleProductMapper.toDrizzle(product))
      .returning();

    if (!created) {
      throw new Error("Failed to create product");
    }

    return DrizzleProductMapper.toDomain(created);
  }

  async findAll(): Promise<Product[]> {
    const results = await db.select().from(products);
    return results.map(DrizzleProductMapper.toDomain);
  }

  async findById(id: string): Promise<Product | null> {
    const [result] = await db
      .select()
      .from(products)
      .where(eq(products.id, parseInt(id)))
      .limit(1);

    if (!result) return null;

    return DrizzleProductMapper.toDomain(result);
  }

  async findByName(name: string): Promise<Product | null> {
    const [result] = await db
      .select()
      .from(products)
      .where(eq(products.name, name))
      .limit(1);

    if (!result) return null;

    return DrizzleProductMapper.toDomain(result);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const [updated] = await db
      .update(products)
      .set(DrizzleProductMapper.toUpdateData(data))
      .where(eq(products.id, parseInt(id)))
      .returning();

    if (!updated) {
      throw new Error("Failed to update product");
    }

    return DrizzleProductMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, parseInt(id)));
  }
}
