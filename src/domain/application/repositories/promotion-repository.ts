import { Promotion } from "../../enterprise/entities/promotion";

export interface PromotionRepository {
  create(promotion: Promotion): Promise<Promotion>;
  findAll(): Promise<Promotion[]>;
  findById(id: string): Promise<Promotion | null>;
  findAll(): Promise<Promotion[]>;
  update(id: string, promotion: Partial<Promotion>): Promise<Promotion>;
  delete(id: string): Promise<void>;
}
