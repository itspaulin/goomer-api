import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { DeleteProductUseCase } from "@/domain/application/use-cases/delete-product.use-case";

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async delete(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;

    const result = await this.deleteProductUseCase.execute({ id });

    if (result.isLeft()) {
      const error = result.value as NotFoundError;
      return res.status(404).json({ message: error.message });
    }

    const { message } = result.value;
    return res.status(200).json({ message });
  }
}
