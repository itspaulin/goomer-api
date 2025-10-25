import { PromotionRepository } from "../repositories/promotion-repository";
import { Promotion } from "../../enterprise/entities/promotion";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

type ListPromotionsUseCaseResponse = Either<
  NotFoundError,
  {
    promotions: Promotion[];
  }
>;

export class ListPromotionsUseCase {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute(): Promise<ListPromotionsUseCaseResponse> {
    const promotions = await this.promotionRepository.findAll();

    if (!promotions || promotions.length === 0) {
      return left(new NotFoundError("No promotions found"));
    }

    return right({
      promotions,
    });
  }
}
