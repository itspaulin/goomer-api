import { ProductRepository } from "../repositories/product-repository";
import { Product } from "../../enterprise/entities/product";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

type ListProductsUseCaseResponse = Either<
  NotFoundError,
  {
    products: Product[];
  }
>;

export class ListProductsUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<ListProductsUseCaseResponse> {
    const products = await this.productRepository.findAll();

    if (!products || products.length === 0) {
      return left(new NotFoundError("No products found"));
    }

    return right({
      products,
    });
  }
}
