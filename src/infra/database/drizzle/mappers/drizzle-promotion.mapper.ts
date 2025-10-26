import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

export class DrizzlePromotionMapper {
  static toDrizzle(promotion: Promotion) {
    return {
      product_id: promotion.product_id,
      description: promotion.description,
      promotional_price: promotion.promotional_price.toString(),
      days: JSON.stringify(promotion.days),
      start_time: promotion.start_time,
      end_time: promotion.end_time,
    };
  }

  static toDomain(raw: any): Promotion {
    return Promotion.create(
      {
        product_id: raw.product_id,
        description: raw.description,
        promotional_price: parseFloat(raw.promotional_price),
        days: JSON.parse(raw.days),
        start_time: raw.start_time,
        end_time: raw.end_time,
        created_at: new Date(raw.created_at),
        updated_at: new Date(raw.updated_at),
      },
      new UniqueEntityId(raw.id.toString())
    );
  }

  static toUpdateData(data: Partial<Promotion>) {
    const updateData: Record<string, any> = { updated_at: new Date() };

    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.promotional_price !== undefined)
      updateData.promotional_price = data.promotional_price.toString();
    if (data.days !== undefined) updateData.days = JSON.stringify(data.days);
    if (data.start_time !== undefined) updateData.start_time = data.start_time;
    if (data.end_time !== undefined) updateData.end_time = data.end_time;

    return updateData;
  }
}
