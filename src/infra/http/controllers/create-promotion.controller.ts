import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { Request, Response } from "express";
import {
  CreatePromotionBody,
  createPromotionBodySchema,
} from "../schemas/promotion.schema";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";

export class CreatePromotionController {
  constructor(private createPromotionUseCase: CreatePromotionUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    const body: CreatePromotionBody = createPromotionBodySchema.parse(req.body);

    const result = await this.createPromotionUseCase.execute(body);

    if (result.isLeft()) {
      throw new BadRequestError();
    }

    const { promotion } = result.value;

    return res.status(201).json({ promotion });
  }
}
