import { PromotionRepository } from "../repositories/promotion-repository";
import { Promotion } from "../../enterprise/entities/promotion";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";

interface UpdatePromotionUseCaseRequest {
  id: string;
  description?: string;
  promotional_price?: number;
  days?: string[];
  start_time?: string;
  end_time?: string;
}

type UpdatePromotionUseCaseResponse = Either<
  NotFoundError,
  {
    promotion: Promotion;
  }
>;

export class UpdatePromotionUseCase {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    id,
    description,
    promotional_price,
    days,
    start_time,
    end_time,
  }: UpdatePromotionUseCaseRequest): Promise<UpdatePromotionUseCaseResponse> {
    const existingPromotion = await this.promotionRepository.findById(id);

    if (!existingPromotion) {
      return left(new NotFoundError("Promotion not found"));
    }

    const updatedPromotion = await this.promotionRepository.update(id, {
      description,
      promotional_price,
      days,
      start_time,
      end_time,
      updated_at: new Date(),
    });

    return right({
      promotion: updatedPromotion,
    });
  }
}
