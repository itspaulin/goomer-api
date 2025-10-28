import request from "supertest";
import express, { Express } from "express";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { UpdatePromotionUseCase } from "@/domain/application/use-cases/update-promotion.use-case";
import { UpdatePromotionController } from "@/infra/http/controllers/update-promotion.controller";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { Product } from "@/domain/enterprise/entities/product";
import { updatePromotionBodySchema } from "../schemas/promotion.schema";

describe("UpdatePromotionController (E2E)", () => {
  let promotionRepository: InMemoryPromotionRepository;
  let productRepository: InMemoryProductRepository;
  let app: Express;

  beforeEach(async () => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();

    const useCase = new UpdatePromotionUseCase(
      promotionRepository,
      productRepository
    );
    const controller = new UpdatePromotionController(useCase);

    app = express();
    app.use(express.json());
    app.patch("/promotions/:id", async (req, res, next) => {
      try {
        await controller.update(req, res);
      } catch (error) {
        next(error);
      }
    });

    // Middleware de erro para Zod
    app.use((err: any, req: any, res: any, next: any) => {
      if (err.name === "ZodError") {
        return res.status(400).json({
          issues: err.issues,
        });
      }
      return res.status(500).json({
        message: "Internal server error",
      });
    });

    const product = Product.create(
      {
        name: "Pizza Margherita",
        price: 45,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );
    await productRepository.create(product);

    const promotion = Promotion.create(
      {
        product_id: 1,
        description: "Promo antiga",
        promotional_price: 40,
        days: ["Segunda"],
        start_time: "18:00",
        end_time: "22:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );
    await promotionRepository.create(promotion);
  });

  afterEach(() => {
    promotionRepository.items = [];
    productRepository.items = [];
  });

  it("deve atualizar uma promoção existente com sucesso", async () => {
    const response = await request(app)
      .patch("/promotions/1")
      .send({
        description: "Promo atualizada",
        promotional_price: 35,
        days: ["Terça"],
        start_time: "19:00",
        end_time: "23:00",
      });

    expect(response.status).toBe(200);
    const { promotion } = response.body;
    expect(promotion.description).toBe("Promo atualizada");
  });

  it("deve retornar 404 se a promoção não existir", async () => {
    const response = await request(app)
      .patch("/promotions/999")
      .send({
        description: "Inexistente",
        promotional_price: 30,
        days: ["Sexta"],
        start_time: "17:00",
        end_time: "21:00",
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Promotion not found");
  });

  it("deve retornar 400 se o horário for inválido", async () => {
    const invalidBody = {
      description: "Promo erro horário",
      start_time: "17:07",
      end_time: "21:00",
    };

    expect(() => {
      updatePromotionBodySchema.parse(invalidBody);
    }).toThrow();
  });

  it("deve retornar 400 se o horário final for antes do inicial", async () => {
    const response = await request(app).patch("/promotions/1").send({
      start_time: "20:00",
      end_time: "19:00",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("End time must be after start time");
  });

  it("deve retornar 404 se o produto informado não existir", async () => {
    const response = await request(app).patch("/promotions/1").send({
      product_id: 999,
      description: "Produto inexistente",
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Produto não encontrado");
  });
});
