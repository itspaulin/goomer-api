import { describe, it, expect, beforeEach } from "vitest";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { DeletePromotionUseCase } from "./delete-promotion.use-case";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";

let promotionRepository: InMemoryPromotionRepository;
let productRepository: InMemoryProductRepository;
let sut: DeletePromotionUseCase;

describe("DeletePromotionUseCase", () => {
  beforeEach(async () => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();
    sut = new DeletePromotionUseCase(promotionRepository);

    const product = Product.create(
      {
        name: "Pizza Margherita",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );
    await productRepository.create(product);
  });

  it("deve ser possível deletar uma promoção", async () => {
    const promotion = Promotion.create(
      {
        product_id: 1,
        description: "Happy Hour",
        promotional_price: 22.95,
        days: ["monday", "wednesday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );
    await promotionRepository.create(promotion);

    expect(promotionRepository.items).toHaveLength(1);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.message).toBe("Promotion deleted successfully");
    }

    expect(promotionRepository.items).toHaveLength(0);
  });

  it("não deve ser possível deletar uma promoção inexistente", async () => {
    const result = await sut.execute({
      id: "999",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve deletar apenas a promoção especificada", async () => {
    const promotion1 = Promotion.create(
      {
        product_id: 1,
        description: "Happy Hour",
        promotional_price: 22.95,
        days: ["monday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const promotion2 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção de Fim de Semana",
        promotional_price: 20.0,
        days: ["saturday", "sunday"],
        start_time: "12:00",
        end_time: "14:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await promotionRepository.create(promotion1);
    await promotionRepository.create(promotion2);

    expect(promotionRepository.items).toHaveLength(2);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);
    expect(promotionRepository.items).toHaveLength(1);

    const remainingPromotion = promotionRepository.items[0];
    expect(remainingPromotion).toBeDefined();
    expect(remainingPromotion?.id.toString()).toBe("2");
  });

  it("deve permitir deletar múltiplas promoções em sequência", async () => {
    const promotion1 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção 1",
        promotional_price: 20.0,
        days: ["monday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const promotion2 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção 2",
        promotional_price: 25.0,
        days: ["tuesday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await promotionRepository.create(promotion1);
    await promotionRepository.create(promotion2);

    const result1 = await sut.execute({ id: "1" });
    expect(result1.isRight()).toBe(true);
    expect(promotionRepository.items).toHaveLength(1);

    const result2 = await sut.execute({ id: "2" });
    expect(result2.isRight()).toBe(true);
    expect(promotionRepository.items).toHaveLength(0);
  });
});
