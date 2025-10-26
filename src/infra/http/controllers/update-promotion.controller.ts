import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { UpdatePromotionUseCase } from "@/domain/application/use-cases/update-promotion.use-case";
import {
  UpdatePromotionBody,
  updatePromotionBodySchema,
} from "../schemas/promotion.schema";

export class UpdatePromotionController {
  constructor(private updatePromotionUseCase: UpdatePromotionUseCase) {}

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;
    const body: UpdatePromotionBody = updatePromotionBodySchema.parse(req.body);

    const { description, promotional_price, days, start_time, end_time } = body;

    const result = await this.updatePromotionUseCase.execute({
      id,
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

        default:
          return res.status(500).json({
            message: "Internal server error",
          });
      }
    }

    const { promotion } = result.value;
    return res.status(200).json({ promotion });
  }
}
