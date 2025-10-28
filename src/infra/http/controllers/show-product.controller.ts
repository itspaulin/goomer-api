import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { ShowProductUseCase } from "@/domain/application/use-cases/show-product.use-case";
import { ProductPresenter } from "../presenters/product.presenter";

export class ShowProductController {
  constructor(private showProductUseCase: ShowProductUseCase) {}

  async show(req: Request<{ id: string }>, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const result = await this.showProductUseCase.execute({ id });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case NotFoundError:
            return res.status(404).json({ message: error.message });
          default:
            return res.status(500).json({ message: "Internal server error" });
        }
      }

      const { product } = result.value;
      return res.status(200).json({
        product: ProductPresenter.toHTTPList([product])[0],
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
