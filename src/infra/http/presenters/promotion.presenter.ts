import { Promotion } from "@/domain/enterprise/entities/promotion";

export interface PromotionHTTP {
  id: string;
  product_id: number;
  description: string;
  promotional_price: number;
  days: string[];
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string | null;
}

export class PromotionPresenter {
  static toHTTP(promotion: Promotion): PromotionHTTP {
    return {
      id: promotion.id.toString(),
      product_id: promotion.product_id,
      description: promotion.description,
      promotional_price: promotion.promotional_price,
      days: promotion.days,
      start_time: promotion.start_time,
      end_time: promotion.end_time,
      created_at: promotion.created_at.toISOString(),
      updated_at: promotion.updated_at?.toISOString() ?? null,
    };
  }

  static toHTTPList(promotions: Promotion[]): PromotionHTTP[] {
    return promotions.map(this.toHTTP);
  }
}
