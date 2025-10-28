import { PromotionRepository } from "../repositories/promotion-repository";
import { Promotion, PromotionProps } from "../../enterprise/entities/promotion";
import { Either, left, right } from "@/core/either";
import { BadRequestError } from "./errors/bad-request.error";
import { NotFoundError } from "./errors/not-found.error";
import { ProductRepository } from "../repositories/product-repository";
import { Time } from "@/domain/enterprise/value-objects/time";
import { InvalidPromotionalPriceError } from "./errors/invalid-promotional-price.error";

interface CreatePromotionUseCaseRequest {
  product_id: number;
  description: string;
  promotional_price: number;
  days: string[];
  start_time: string;
  end_time: string;
}

type CreatePromotionUseCaseResponse = Either<
  BadRequestError | NotFoundError | InvalidPromotionalPriceError,
  {
    promotion: Promotion;
  }
>;

export class CreatePromotionUseCase {
  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    product_id,
    description,
    promotional_price,
    days,
    start_time,
    end_time,
  }: CreatePromotionUseCaseRequest): Promise<CreatePromotionUseCaseResponse> {
    const startTime = Time.create(start_time);
    if (!startTime) {
      return left(
        new BadRequestError(
          "Invalid start time. Use HH:mm format with multiples of 15 minutes (e.g., 18:00, 18:15, 18:30, 18:45)"
        )
      );
    }

    const endTime = Time.create(end_time);
    if (!endTime) {
      return left(
        new BadRequestError(
          "Invalid end time. Use HH:mm format with multiples of 15 minutes (e.g., 20:00, 20:15, 20:30, 20:45)"
        )
      );
    }

    if (endTime.isBefore(startTime) || endTime.equals(startTime)) {
      return left(new BadRequestError("End time must be after start time"));
    }

    const productExists = await this.productRepository.findById(
      product_id.toString()
    );
    if (!productExists) {
      return left(new NotFoundError("Product not found"));
    }

    if (promotional_price >= productExists.price) {
      return left(new InvalidPromotionalPriceError());
    }

    const promotion = Promotion.create({
      product_id,
      description,
      promotional_price,
      days,
      start_time: startTime.toString(),
      end_time: endTime.toString(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const createdPromotion = await this.promotionRepository.create(promotion);

    return right({
      promotion: createdPromotion,
    });
  }
}
