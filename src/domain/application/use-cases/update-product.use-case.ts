import { ProductRepository } from "../repositories/product-repository";
import { Product, ProductProps } from "../../enterprise/entities/product";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

interface UpdateProductUseCaseRequest {
  id: string;
  name?: string;
  price?: number;
  category?: "Entradas" | "Pratos principais" | "Sobremesas" | "Bebidas";
  visible?: boolean;
  order?: number;
}

type UpdateProductUseCaseResponse = Either<
  NotFoundError,
  {
    product: Product;
  }
>;

export class UpdateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
    name,
    price,
    category,
    visible,
    order,
  }: UpdateProductUseCaseRequest): Promise<UpdateProductUseCaseResponse> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      return left(new NotFoundError("Product not found"));
    }

    const updateData: Partial<ProductProps> = {
      updated_at: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (visible !== undefined) updateData.visible = visible;
    if (order !== undefined) updateData.order = order;

    const updatedProduct = await this.productRepository.update(id, updateData);

    console.log("🔍 UseCase - received params:", {
      id,
      name,
      price,
      category,
      visible,
      order,
    });
    console.log("🔍 UseCase - updateData:", updateData);

    return right({
      product: updatedProduct,
    });
  }
}
