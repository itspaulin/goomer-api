import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { UpdatePromotionUseCase } from "@/domain/application/use-cases/update-promotion.use-case";
import { PromotionPresenter } from "../presenters/promotion.presenter";
import {
  UpdatePromotionBody,
  updatePromotionBodySchema,
} from "../schemas/promotion.schema";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";

export class UpdatePromotionController {
  constructor(private updatePromotionUseCase: UpdatePromotionUseCase) {}

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    const body: UpdatePromotionBody = updatePromotionBodySchema.parse(req.body);

    const {
      product_id,
      description,
      promotional_price,
      days,
      start_time,
      end_time,
    } = body;

    const result = await this.updatePromotionUseCase.execute({
      id,
      product_id,
      description,
      promotional_price,
      days,
      start_time,
      end_time,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotFoundError:
          return res.status(404).json({
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
    return res.status(200).json({
      promotion: PromotionPresenter.toHTTP(promotion),
    });
  }
}
