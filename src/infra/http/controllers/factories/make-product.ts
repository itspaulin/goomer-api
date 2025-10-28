import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface MakeProductOptions {
  name?: string;
  price?: number;
  category?: "Entradas" | "Pratos principais" | "Sobremesas" | "Bebidas";
  visible?: boolean;
  order?: number;
  id?: string;
}

export function makeProduct(options: MakeProductOptions = {}): Product {
  return Product.create(
    {
      name: options.name ?? "Pizza Margherita",
      price: options.price ?? 45.9,
      category: options.category ?? "Pratos principais",
      visible: options.visible ?? true,
      order: options.order ?? 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    options.id ? new UniqueEntityId(options.id) : undefined
  );
}
