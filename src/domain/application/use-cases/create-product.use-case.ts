import { Either, right } from "@/core/either";
import { ProductRepository } from "../repositories/product-repository";
import { Product } from "@/domain/enterprise/entities/product";

interface CreateProductUseCaseRequest {
  name: string;
  price: number;
  category: "Entradas" | "Pratos principais" | "Sobremesas" | "Bebidas";
  visible: boolean;
  order: number;
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product;
  }
>;

export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    price,
    category,
    visible,
    order,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      name,
      price,
      category,
      visible,
      order,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createdProduct = await this.productRepository.create(product);

    return right({
      product: createdProduct,
    });
  }
}
