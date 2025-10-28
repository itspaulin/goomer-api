import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { ListPromotionsUseCase } from "@/domain/application/use-cases/list-promotions.use-case";
import { ListPromotionsController } from "@/infra/http/controllers/list-promotions.controller";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("ListPromotionsController (E2E)", () => {
  let repository: InMemoryPromotionRepository;
  let app: Express;

  beforeEach(async () => {
    repository = new InMemoryPromotionRepository();
    const useCase = new ListPromotionsUseCase(repository);
    const controller = new ListPromotionsController(useCase);

    app = express();
    app.use(express.json());
    app.get("/promotions", (req, res) => controller.list(res));

    const promo1 = Promotion.create(
      {
        product_id: 1,
        description: "Segunda: Pizza com 30% off",
        promotional_price: 32.13,
        days: ["Segunda"],
        start_time: "18:00",
        end_time: "22:00",
        created_at: new Date("2025-10-27T10:00:00Z"),
        updated_at: new Date("2025-10-27T10:00:00Z"),
      },
      new UniqueEntityId("1")
    );

    const promo2 = Promotion.create(
      {
        product_id: 2,
        description: "Terça: Bebida grátis",
        promotional_price: 0,
        days: ["Terça"],
        start_time: "11:00",
        end_time: "15:00",
        created_at: new Date("2025-10-27T12:00:00Z"),
        updated_at: new Date("2025-10-27T12:00:00Z"),
      },
      new UniqueEntityId("2")
    );

    await repository.create(promo1);
    await repository.create(promo2);
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve listar todas as promoções com sucesso", async () => {
    const response = await request(app).get("/promotions");

    expect(response.status).toBe(200);
    const { promotions } = response.body;

    expect(promotions).toHaveLength(2);
    expect(promotions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "1",
          product_id: 1,
          description: "Segunda: Pizza com 30% off",
          promotional_price: 32.13,
          days: ["Segunda"],
          start_time: "18:00",
          end_time: "22:00",
        }),
        expect.objectContaining({
          id: "2",
          product_id: 2,
          description: "Terça: Bebida grátis",
          promotional_price: 0,
          days: ["Terça"],
          start_time: "11:00",
          end_time: "15:00",
        }),
      ])
    );
  });

  it("deve retornar 404 se não houver promoções", async () => {
    repository.items = [];

    const response = await request(app).get("/promotions");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No promotions found");
  });

  it("deve manter a ordem de inserção das promoções", async () => {
    const response = await request(app).get("/promotions");

    const { promotions } = response.body;

    expect(promotions[0].id).toBe("1");
    expect(promotions[1].id).toBe("2");
  });

  it("deve formatar datas como ISO string", async () => {
    const response = await request(app).get("/promotions");

    const { promotions } = response.body;

    promotions.forEach((promo: any) => {
      expect(promo.created_at).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(promo.updated_at).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );
      expect(typeof promo.created_at).toBe("string");
      expect(typeof promo.updated_at).toBe("string");
    });
  });
});
