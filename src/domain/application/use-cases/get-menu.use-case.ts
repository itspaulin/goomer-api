import { Either, right } from "@/core/either";
import { ProductRepository } from "../repositories/product-repository";
import { PromotionRepository } from "../repositories/promotion-repository";
import { MenuByCategory, MenuUtils } from "./utils/menu-utils";
import { DateUtils } from "@/core/utils/date-utils";

interface GetMenuUseCaseResponse {
  menu: MenuByCategory[];
}

type GetMenuUseCaseResult = Either<null, GetMenuUseCaseResponse>;

export class GetMenuUseCase {
  constructor(
    private productRepository: ProductRepository,
    private promotionRepository: PromotionRepository
  ) {}
  async execute(): Promise<GetMenuUseCaseResult> {
    const products = await this.productRepository.findAllVisible();

    const promotions = await this.promotionRepository.findAll();

    const now = new Date();
    const currentDay = DateUtils.getDayName(now);
    const currentTime = DateUtils.formatTime(now);

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
    });
  }
}
