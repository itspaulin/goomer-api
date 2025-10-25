import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../../enterprise/entities/product";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

interface ShowProductUseCaseRequest {
  id: string;
}

type ShowProductUseCaseResponse = Either<
  NotFoundError,
  {
    product: Product;
  }
>;

export class ShowProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
  }: ShowProductUseCaseRequest): Promise<ShowProductUseCaseResponse> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      return left(new NotFoundError("Product not found"));
    }

    return right({
      product,
    });
  }
}
