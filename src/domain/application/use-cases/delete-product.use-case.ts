import { ProductRepository } from "../repositories/product-repository";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

interface DeleteProductUseCaseRequest {
  id: string;
}

type DeleteProductUseCaseResponse = Either<
  NotFoundError,
  {
    message: string;
  }
>;

export class DeleteProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    id,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      return left(new NotFoundError("Product not found"));
    }

    await this.productRepository.delete(id);

    return right({
      message: "Product deleted successfully",
    });
  }
}
