// drizzle-promotion.repository.ts
import { PromotionRepository } from "@/domain/application/repositories/promotion-repository";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { sql } from "drizzle-orm";
import { db } from "../../index";
import { DrizzlePromotionMapper } from "../mappers/drizzle-promotion.mapper";

export class DrizzlePromotionRepository implements PromotionRepository {
  async create(promotion: Promotion): Promise<Promotion> {
    const data = DrizzlePromotionMapper.toDrizzle(promotion);

    const result = await db.execute(sql`
      INSERT INTO promotions (description, promotional_price, days, start_time, end_time, created_at, updated_at)
      VALUES (
        ${data.description}, 
        ${data.promotional_price}, 
        ${data.days}, 
        ${data.start_time}, 
        ${data.end_time}, 
        NOW(), 
        NOW()
      )
      RETURNING *
    `);

    const created = result[0];
    if (!created) {
      throw new Error("Failed to create promotion");
    }

    return DrizzlePromotionMapper.toDomain(created as any);
  }

  async findAll(): Promise<Promotion[]> {
    const result = await db.execute(sql`
      SELECT * FROM promotions
    `);

    return result.map((raw) => DrizzlePromotionMapper.toDomain(raw as any));
  }

  async findById(id: string): Promise<Promotion | null> {
    const result = await db.execute(sql`
      SELECT * FROM promotions WHERE id = ${parseInt(id)} LIMIT 1
    `);

    if (!result[0]) return null;

    return DrizzlePromotionMapper.toDomain(result[0] as any);
  }

  async update(id: string, data: Partial<Promotion>): Promise<Promotion> {
    const updateData = DrizzlePromotionMapper.toUpdateData(data);

    const { updated_at, ...restData } = updateData;

    const setClause = Object.entries(restData)
      .map(([key, value], index) =>
        index === 0
          ? sql`${sql.identifier(key)} = ${value}`
          : sql`, ${sql.identifier(key)} = ${value}`
      )
      .reduce((acc, curr) => sql`${acc}${curr}`);

    const result = await db.execute(sql`
      UPDATE promotions 
      SET ${setClause}, updated_at = NOW()
      WHERE id = ${parseInt(id)}
      RETURNING *
    `);

    if (!result[0]) {
      throw new Error("Failed to update promotion");
    }

    return DrizzlePromotionMapper.toDomain(result[0] as any);
  }

  async delete(id: string): Promise<void> {
    await db.execute(sql`
      DELETE FROM promotions WHERE id = ${parseInt(id)}
    `);
  }
}
