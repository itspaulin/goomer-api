import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Product as DrizzleProduct } from "../schemas/products";

export class DrizzleProductMapper {
  static toDomain(raw: DrizzleProduct): Product {
    return Product.create(
      {
        name: raw.name,
        price: parseFloat(raw.price),
        category: raw.category,
        visible: raw.visible ?? true,
        order: raw.order ?? 0,
        created_at: raw.created_at ?? new Date(),
        updated_at: raw.updated_at ?? new Date(),
      },
      new UniqueEntityId(raw.id.toString())
    );
  }

  static toDrizzle(product: Product) {
    return {
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      visible: product.visible,
      order: product.order,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }

  static toUpdateData(data: Partial<Product>) {
    const updateData: Record<string, any> = { updated_at: new Date() };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.price !== undefined) updateData.price = data.price.toString();
    if (data.category !== undefined) updateData.category = data.category;
    if (data.visible !== undefined) updateData.visible = data.visible;
    if (data.order !== undefined) updateData.order = data.order;

    return updateData;
  }
}
