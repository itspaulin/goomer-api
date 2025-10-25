import { ProductRepository } from "@/domain/application/repositories/product-repository";
import { Product } from "@/domain/enterprise/entities/product";
import { eq, sql } from "drizzle-orm";
import { products } from "../../drizzle/schemas/products";
import { db } from "../../index";
import { DrizzleProductMapper } from "../mappers/drizzle-product.mapper";

export class DrizzleProductRepository implements ProductRepository {
  async create(product: Product): Promise<Product> {
    const data = DrizzleProductMapper.toDrizzle(product);

    const result = await db.execute(sql`
    INSERT INTO products (name, price, category, visible, "order", created_at, updated_at)
    VALUES (
      ${data.name}, 
      ${data.price}, 
      ${data.category}, 
      ${data.visible}, 
      ${data.order}, 
      NOW(), 
      NOW()
    )
    RETURNING *
  `);

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create product");
    }

    return DrizzleProductMapper.toDomain(created as any);
  }

  async findAll(): Promise<Product[]> {
    const result = await db.execute(sql`
      SELECT * FROM products
    `);

    return result.map((raw) => DrizzleProductMapper.toDomain(raw as any));
  }

  async findById(id: string): Promise<Product | null> {
    const result = await db.execute(sql`
      SELECT * FROM products WHERE id = ${parseInt(id)} LIMIT 1
    `);

    if (!result[0]) return null;

    return DrizzleProductMapper.toDomain(result[0] as any);
  }

  async findByName(name: string): Promise<Product | null> {
    const result = await db.execute(sql`
      SELECT * FROM products WHERE name = ${name} LIMIT 1
    `);

    if (!result[0]) return null;

    return DrizzleProductMapper.toDomain(result[0] as any);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const updateData = DrizzleProductMapper.toUpdateData(data);

    const { updated_at, ...restData } = updateData;

    const setClause = Object.entries(restData)
      .map(([key, value], index) =>
        index === 0
          ? sql`${sql.identifier(key)} = ${value}`
          : sql`, ${sql.identifier(key)} = ${value}`
      )
      .reduce((acc, curr) => sql`${acc}${curr}`);

    const result = await db.execute(sql`
      UPDATE products 
      SET ${setClause}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `);

    if (!result[0]) {
      throw new Error("Failed to update product");
    }

    return DrizzleProductMapper.toDomain(result[0] as any);
  }

  async delete(id: string): Promise<void> {
    await db.execute(sql`
      DELETE FROM products WHERE id = ${parseInt(id)}
    `);
  }
}
