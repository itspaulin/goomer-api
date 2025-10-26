import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { ListPromotionsUseCase } from "@/domain/application/use-cases/list-promotions.use-case";

export class ListPromotionsController {
  constructor(private listPromotionsUseCase: ListPromotionsUseCase) {}

  async list(res: Response): Promise<Response> {
    const result = await this.listPromotionsUseCase.execute();

    if (result.isLeft()) {
      const error = result.value as NotFoundError;
      return res.status(404).json({ message: error.message });
    }

    const { promotions } = result.value;
    return res.status(200).json({ promotions });
  }
}
