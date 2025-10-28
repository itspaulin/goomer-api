import { GetMenuUseCase } from "@/domain/application/use-cases/get-menu.use-case";
import { DrizzleProductRepository } from "@/infra/database/drizzle/repositories/drizzle-product-repository";
import { DrizzlePromotionRepository } from "@/infra/database/drizzle/repositories/drizzle-promotion-repository";
import { GetMenuController } from "@/infra/http/controllers/get-menu.controller";
import { LuxonDateTimeProvider } from "@/infra/providers/luxon-datetime-provider";

export function makeGetMenuController() {
  const productRepository = new DrizzleProductRepository();
  const promotionRepository = new DrizzlePromotionRepository();
  const dateTimeProvider = new LuxonDateTimeProvider();

  const getMenuUseCase = new GetMenuUseCase(
    productRepository,
    promotionRepository,
    dateTimeProvider
  );

  const getMenuController = new GetMenuController(getMenuUseCase);

  return getMenuController;
}
