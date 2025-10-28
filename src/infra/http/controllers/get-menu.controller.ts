import { GetMenuUseCase } from "@/domain/application/use-cases/get-menu.use-case";
import { Request, Response } from "express";

export class GetMenuController {
  constructor(private getMenuUseCase: GetMenuUseCase) {}

  async getMenu(req: Request, res: Response): Promise<Response> {
    const { timezone } = req.query;

    const result = await this.getMenuUseCase.execute({
      timezone: timezone as string,
    });

    if (result.isLeft()) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    const { menu, metadata } = result.value;

    return res.status(200).json({
      menu,
      metadata,
    });
  }
}
