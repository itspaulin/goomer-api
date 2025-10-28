import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { DeletePromotionUseCase } from "@/domain/application/use-cases/delete-promotion.use-case";
import { DeletePromotionController } from "@/infra/http/controllers/delete-promotion.controller";
import { makeMockRequest, makeMockResponse } from "@test/utils/mock-express";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("DeletePromotionController (E2E)", () => {
  let repository: InMemoryPromotionRepository;
  let controller: DeletePromotionController;

  beforeEach(async () => {
    repository = new InMemoryPromotionRepository();
    const useCase = new DeletePromotionUseCase(repository);
    controller = new DeletePromotionController(useCase);

    const promotion1 = Promotion.create(
      {
        product_id: 1,
        description: "Segunda-feira: Pizza com 30% off",
        promotional_price: 32.13,
        days: ["Segunda"],
        start_time: "18:00",
        end_time: "22:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const promotion2 = Promotion.create(
      {
        product_id: 2,
        description: "Terça: Bebida grátis na compra de prato",
        promotional_price: 0,
        days: ["Terça"],
        start_time: "11:00",
        end_time: "15:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await repository.create(promotion1);
    await repository.create(promotion2);
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve deletar uma promoção com sucesso", async () => {
    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(200);
    expect(getBody().message).toBeDefined();
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]?.id.toString()).toBe("2");
  });

  it("deve retornar 404 ao tentar deletar promoção inexistente", async () => {
    const req = makeMockRequest({}, { id: "999" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(404);
    expect(getBody().message).toBeDefined();
    expect(repository.items).toHaveLength(2);
  });

  it("deve manter outras promoções ao deletar uma específica", async () => {
    const initialCount = repository.items.length;

    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(200);
    expect(repository.items).toHaveLength(initialCount - 1);

    const remainingPromotion = repository.items[0];
    expect(remainingPromotion?.id.toString()).toBe("2");
    expect(remainingPromotion?.description).toBe(
      "Terça: Bebida grátis na compra de prato"
    );
    expect(remainingPromotion?.days).toEqual(["Terça"]);
  });
});
