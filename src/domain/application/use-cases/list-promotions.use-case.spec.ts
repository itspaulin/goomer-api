import { describe, it, expect, beforeEach } from "vitest";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { ListPromotionsUseCase } from "./list-promotions.use-case";

let promotionRepository: InMemoryPromotionRepository;
let sut: ListPromotionsUseCase;

describe("ListPromotionsUseCase", () => {
  beforeEach(() => {
    promotionRepository = new InMemoryPromotionRepository();
    sut = new ListPromotionsUseCase(promotionRepository);
  });

  it("deve listar todas as promoções", async () => {
    const promotion1 = Promotion.create(
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

    const promotion2 = Promotion.create(
      {
        product_id: 2,
        description: "Promoção Fim de Semana",
        promotional_price: 35.0,
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

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotions).toHaveLength(2);
      expect(result.value.promotions).toContain(promotion1);
      expect(result.value.promotions).toContain(promotion2);
    }
  });

  it("deve retornar erro quando não houver promoções", async () => {
    const result = await sut.execute();

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve listar promoções com diferentes horários", async () => {
    const promotion1 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção Manhã",
        promotional_price: 20.0,
        days: ["monday"],
        start_time: "08:00",
        end_time: "12:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const promotion2 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção Tarde",
        promotional_price: 25.0,
        days: ["monday"],
        start_time: "14:00",
        end_time: "18:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await promotionRepository.create(promotion1);
    await promotionRepository.create(promotion2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotions).toHaveLength(2);
    }
  });

  it("deve listar promoções com diferentes dias da semana", async () => {
    const promotion1 = Promotion.create(
      {
        product_id: 1,
        description: "Promoção Segunda",
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
        product_id: 2,
        description: "Promoção Fim de Semana",
        promotional_price: 30.0,
        days: ["friday", "saturday", "sunday"],
        start_time: "12:00",
        end_time: "23:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await promotionRepository.create(promotion1);
    await promotionRepository.create(promotion2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotions).toHaveLength(2);
      expect(result.value.promotions![0]!.days).toHaveLength(1);
      expect(result.value.promotions![1]!.days).toHaveLength(3);
    }
  });
});
