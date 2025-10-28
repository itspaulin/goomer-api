import { Request, Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { UpdateProductUseCase } from "@/domain/application/use-cases/update-product.use-case";
import { ProductPresenter } from "../presenters/product.presenter";
import {
  UpdateProductBody,
  updateProductBodySchema,
} from "../schemas/product.schema";

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async update(req: Request<{ id: string }>, res: Response): Promise<Response> {
    const { id } = req.params;

    const body: UpdateProductBody = updateProductBodySchema.parse(req.body);
    console.log("🔍 Controller - body parsed:", body);

    const updateData = Object.entries(body).reduce(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      },
      { id } as any
    );

    console.log("🔍 Controller - updateData:", updateData);

    const result = await this.updateProductUseCase.execute(updateData);

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

    const { product } = result.value;
    return res.status(200).json({
      product: ProductPresenter.toHTTP(product),
    });
  }
}
