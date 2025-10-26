import { PromotionRepository } from "../repositories/promotion-repository";
import { Promotion, PromotionProps } from "../../enterprise/entities/promotion";
import { Either, right } from "@/core/either";
import { BadRequestError } from "./errors/bad-request.error";

interface CreatePromotionUseCaseRequest {
  product_id: number;
  description: string;
  promotional_price: number;
  days: string[];
  start_time: string;
  end_time: string;
}

type CreatePromotionUseCaseResponse = Either<
  null,
  {
    promotion: Promotion;
  }
>;

export class CreatePromotionUseCase {
  constructor(private promotionRepository: PromotionRepository) {}

  async execute({
    product_id,
    description,
    promotional_price,
    days,
    start_time,
    end_time,
  }: CreatePromotionUseCaseRequest): Promise<CreatePromotionUseCaseResponse> {
    const promotion = Promotion.create({
      product_id,
      description,
      promotional_price,
      days,
      start_time,
      end_time,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createdPromotion = await this.promotionRepository.create(promotion);

    return right({
      promotion: createdPromotion,
    });
  }
}
