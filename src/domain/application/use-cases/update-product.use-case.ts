import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../../enterprise/entities/product";
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

    const updatedProduct = await this.productRepository.update(id, {
      name,
      price,
      category,
      visible,
      order,
      updated_at: new Date(),
    });

    return right({
      product: updatedProduct,
    });
  }
}
