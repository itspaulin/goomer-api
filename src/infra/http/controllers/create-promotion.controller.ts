import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { Request, Response } from "express";
import {
  CreatePromotionBody,
  createPromotionBodySchema,
} from "../schemas/promotion.schema";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InvalidPromotionalPriceError } from "@/domain/application/use-cases/errors/invalid-promotional-price.error";
import { PromotionPresenter } from "../presenters/promotion.presenter";

export class CreatePromotionController {
  constructor(private createPromotionUseCase: CreatePromotionUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    const body: CreatePromotionBody = createPromotionBodySchema.parse(req.body);

    const result = await this.createPromotionUseCase.execute(body);

    if (result.isLeft()) {
      const error = result.value as Error;

      switch (error.constructor) {
        case NotFoundError:
          return res.status(404).json({
            message: error.message,
          });

        case InvalidPromotionalPriceError:
          return res.status(400).json({
            message: error.message,
          });

        case BadRequestError:
          return res.status(400).json({
            message: error.message,
          });

        default:
          return res.status(500).json({
            message: "Internal server error",
          });
      }
    }

    const { promotion } = result.value;

    return res.status(201).json({
      promotion: PromotionPresenter.toHTTP(promotion),
    });
  }
}
