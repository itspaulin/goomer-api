import { Request, Response } from "express";
import { CreateProductUseCase } from "@/domain/application/use-cases/create-product.use-case";
import {
  CreateProductBody,
  createProductBodySchema,
} from "../schemas/product.schema";
import { ProductAlreadyExistsError } from "@/domain/application/use-cases/errors/product-already-exists.error";
import { InvalidProductDataError } from "@/domain/application/use-cases/errors/invalid-product-data.error";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";

export class ProductsController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async create(req: Request, res: Response): Promise<Response> {
    const body: CreateProductBody = createProductBodySchema.parse(req.body);

    const result = await this.createProductUseCase.execute(body);

    if (result.isLeft()) {
      const error = result.value as Error;

      switch (error.constructor) {
        case ProductAlreadyExistsError:
          return res.status(409).json({
            message: error.message,
          });

        case InvalidProductDataError:
          return res.status(422).json({
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

    const product = result.value;
    return res.status(201).json({ product });
  }
}
