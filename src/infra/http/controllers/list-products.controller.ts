import { Response } from "express";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { ListProductsUseCase } from "@/domain/application/use-cases/list-products.use-case";
import { ProductPresenter } from "../presenters/product.presenter";

export class ListProductsController {
  constructor(private listProductsUseCase: ListProductsUseCase) {}

  async list(res: Response): Promise<Response> {
    const result = await this.listProductsUseCase.execute();

    if (result.isLeft()) {
      const error = result.value as NotFoundError;
      return res.status(404).json({ message: error.message });
    }

    const { products } = result.value;
    return res
      .status(200)
      .json({ products: ProductPresenter.toHTTPList(products) });
  }
}
