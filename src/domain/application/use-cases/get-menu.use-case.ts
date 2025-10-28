import { Either, right } from "@/core/either";
import { ProductRepository } from "../repositories/product-repository";
import { PromotionRepository } from "../repositories/promotion-repository";
import { DateTimeProvider } from "../providers/datetime-provider";
import { MenuByCategory, MenuUtils } from "./utils/menu-utils";
import { TimezoneUtils } from "@/core/utils/timezone-utils";

interface GetMenuUseCaseRequest {
  timezone?: string;
}

interface GetMenuUseCaseResponse {
  menu: MenuByCategory[];
  metadata: {
    timezone: string;
    current_time: string;
    current_day: string;
  };
}

type GetMenuUseCaseResult = Either<null, GetMenuUseCaseResponse>;

export class GetMenuUseCase {
  constructor(
    private productRepository: ProductRepository,
    private promotionRepository: PromotionRepository,
    private dateTimeProvider: DateTimeProvider
  ) {}

  async execute(
    request: GetMenuUseCaseRequest = {}
  ): Promise<GetMenuUseCaseResult> {
    const timezone = TimezoneUtils.normalizeTimezone(request.timezone);

    const products = await this.productRepository.findAllVisible();
    const promotions = await this.promotionRepository.findAll();

    const currentDay = this.dateTimeProvider.getCurrentDay(timezone);

    const currentTime = this.dateTimeProvider.getCurrentTime(timezone);

    const productsWithPromotions = products.map((product) => {
      const productPromotion = promotions.find(
        (promo) => promo.product_id === parseInt(product.id.toString())
      );

      const isPromotionActive = productPromotion
        ? productPromotion.isActive(currentDay, currentTime)
        : false;

      return {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        promotional_price: isPromotionActive
          ? productPromotion?.promotional_price
          : undefined,
        category: product.category,
        order: product.order,
        promotion: productPromotion
          ? {
              description: productPromotion.description,
              active: isPromotionActive,
            }
          : undefined,
      };
    });

    const menuByCategory = MenuUtils.groupByCategory(productsWithPromotions);

    return right({
      menu: menuByCategory,
      metadata: {
        timezone,
        current_time: currentTime,
        current_day: currentDay,
      },
    });
  }
}
