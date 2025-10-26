import { GetMenuUseCase } from "@/domain/application/use-cases/get-menu.use-case";
import { Request, Response } from "express";

export class GetMenuController {
  constructor(private getMenuUseCase: GetMenuUseCase) {}

  async getMenu(req: Request, res: Response): Promise<Response> {
    const result = await this.getMenuUseCase.execute();

    if (result.isLeft()) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    const { menu } = result.value;

    return res.status(200).json({ menu });
  }
}
