import { PromotionRepository } from "../repositories/promotion-repository";
import { Promotion } from "../../enterprise/entities/promotion";
import { Either, right, left } from "@/core/either";
import { NotFoundError } from "./errors/not-found.error";
import { ProductRepository } from "../repositories/product-repository";
import { Time } from "@/domain/enterprise/value-objects/time";
import { BadRequestError } from "./errors/bad-request.error";

interface UpdatePromotionUseCaseRequest {
  id: string;
  product_id?: number;
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
  constructor(
    private promotionRepository: PromotionRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    id,
    product_id,
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

    let validatedStartTime = start_time;
    if (start_time) {
      const startTimeObj = Time.create(start_time);
      if (!startTimeObj) {
        return left(
          new BadRequestError(
            "Invalid start time. Use HH:mm format with multiples of 15 minutes."
          )
        );
      }
      validatedStartTime = startTimeObj.toString();
    }

    let validatedEndTime = end_time;
    if (end_time) {
      const endTimeObj = Time.create(end_time);
      if (!endTimeObj) {
        return left(
          new BadRequestError(
            "Invalid end time. Use HH:mm format with multiples of 15 minutes."
          )
        );
      }
      validatedEndTime = endTimeObj.toString();
    }

    if (start_time && end_time) {
      const startTimeObj = Time.create(start_time)!;
      const endTimeObj = Time.create(end_time)!;

      if (
        endTimeObj.isBefore(startTimeObj) ||
        endTimeObj.equals(startTimeObj)
      ) {
        return left(new BadRequestError("End time must be after start time"));
      }
    }

    if (start_time && !end_time) {
      const startTimeObj = Time.create(start_time)!;
      const existingEndTime = Time.create(existingPromotion.end_time)!;

      if (
        existingEndTime.isBefore(startTimeObj) ||
        existingEndTime.equals(startTimeObj)
      ) {
        return left(
          new BadRequestError(
            "Start time cannot be the same as or later than the existing end time"
          )
        );
      }
    }

    if (end_time && !start_time) {
      const endTimeObj = Time.create(end_time)!;
      const existingStartTime = Time.create(existingPromotion.start_time)!;

      if (
        endTimeObj.isBefore(existingStartTime) ||
        endTimeObj.equals(existingStartTime)
      ) {
        return left(
          new BadRequestError(
            "End time cannot be equal to or earlier than the existing start time"
          )
        );
      }
    }

    if (product_id) {
      const productExists = await this.productRepository.findById(
        product_id.toString()
      );
      if (!productExists) {
        return left(new NotFoundError("Produto não encontrado"));
      }
    }

    const updatedPromotion = await this.promotionRepository.update(id, {
      product_id,
      description,
      promotional_price,
      days,
      start_time: validatedStartTime,
      end_time: validatedEndTime,
    });

    return right({
      promotion: updatedPromotion,
    });
  }
}
