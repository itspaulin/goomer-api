import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { DeletePromotionUseCase } from "@/domain/application/use-cases/delete-promotion.use-case";

export class PromotionsController {
  constructor(private deletePromotionUseCase: DeletePromotionUseCase) {}

  async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await this.deletePromotionUseCase.execute({ id });

    if (result.isLeft()) {
      const error = result.value as NotFoundError;
      return res.status(404).json({ message: error.message });
    }

    const { message } = result.value;
    return res.status(200).json({ message });
  }
}
