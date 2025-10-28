import { PromotionRepository } from "@/domain/application/repositories/promotion-repository";
import { Promotion } from "@/domain/enterprise/entities/promotion";

interface PromotionProps {
  product_id: number;
  description: string;
  promotional_price: number;
  days: string[];
  start_time: string;
  end_time: string;
  created_at: Date;
  updated_at: Date;
}

export class InMemoryPromotionRepository implements PromotionRepository {
  public items: Promotion[] = [];

  async create(promotion: Promotion): Promise<Promotion> {
    this.items.push(promotion);
    return promotion;
  }

  async findById(id: string): Promise<Promotion | null> {
    const promotion = this.items.find((item) => item.id.toString() === id);
    return promotion || null;
  }

  async findByProductId(productId: number): Promise<Promotion | null> {
    const promotion = this.items.find((item) => item.product_id === productId);
    return promotion || null;
  }

  async findAll(): Promise<Promotion[]> {
    return this.items;
  }

  async update(id: string, data: Partial<PromotionProps>): Promise<Promotion> {
    const promotion = this.items.find((item) => item.id.toString() === id);

    if (!promotion) {
      throw new Error("Promotion not found");
    }

    if (data.product_id !== undefined) {
      promotion.product_id = data.product_id;
    }
    if (data.description !== undefined) {
      promotion.description = data.description;
    }
    if (data.promotional_price !== undefined) {
      promotion.promotional_price = data.promotional_price;
    }
    if (data.days !== undefined) {
      promotion.days = data.days;
    }
    if (data.start_time !== undefined) {
      promotion.start_time = data.start_time;
    }
    if (data.end_time !== undefined) {
      promotion.end_time = data.end_time;
    }

    return promotion;
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((item) => item.id.toString() === id);

    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
}
