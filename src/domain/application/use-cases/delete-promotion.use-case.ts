import { PromotionRepository } from "../repositories/promotion-repository";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

interface DeletePromotionUseCaseRequest {
  id: string;
}

type DeletePromotionUseCaseResponse = Either<
  NotFoundError,
  {
    message: string;
  }
>;

export class DeletePromotionUseCase {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    id,
  }: DeletePromotionUseCaseRequest): Promise<DeletePromotionUseCaseResponse> {
    const existingPromotion = await this.promotionRepository.findById(id);

    if (!existingPromotion) {
      return left(new NotFoundError("Promotion not found"));
    }

    await this.promotionRepository.delete(id);

    return right({
      message: "Promotion deleted successfully",
    });
  }
}
