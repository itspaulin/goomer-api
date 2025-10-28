import request from "supertest";
import express, { Express } from "express";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { CreatePromotionController } from "@/infra/http/controllers/create-promotion.controller";
import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("CreatePromotionController (E2E)", () => {
  let promotionRepository: InMemoryPromotionRepository;
  let productRepository: InMemoryProductRepository;
  let app: Express;
  let productId: string;

  beforeEach(async () => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();

    const useCase = new CreatePromotionUseCase(
      promotionRepository,
      productRepository
    );
    const controller = new CreatePromotionController(useCase);

    app = express();
    app.use(express.json());
    app.post("/promotions", (req, res) => controller.create(req, res));

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
    productId = product.id.toString();
  });

  afterEach(() => {
    promotionRepository.items = [];
    productRepository.items = [];
  });

  it("deve criar uma promoção com sucesso", async () => {
    const response = await request(app)
      .post("/promotions")
      .send({
        product_id: 1,
        description: "Promoção de fim de semana",
        promotional_price: 39.9,
        start_time: "18:00",
        end_time: "22:00",
        days: ["Sábado", "Domingo"],
      });

    expect(response.status).toBe(201);
    expect(response.body.promotion).toBeDefined();
    expect(response.body.promotion.description).toBe(
      "Promoção de fim de semana"
    );
    expect(response.body.promotion.promotional_price).toBe(39.9);
    expect(promotionRepository.items).toHaveLength(1);
  });

  it("deve retornar erro ao criar promoção com productId inválido", async () => {
    const response = await request(app)
      .post("/promotions")
      .send({
        product_id: 999999,
        description: "Promoção inválida",
        promotional_price: 39.9,
        start_time: "18:00",
        end_time: "22:00",
        days: ["Sábado", "Domingo"],
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Product not found");
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com preço maior que o produto", async () => {
    const response = await request(app)
      .post("/promotions")
      .send({
        product_id: 1,
        description: "Promoção inválida",
        promotional_price: 100.0,
        start_time: "18:00",
        end_time: "22:00",
        days: ["Sábado", "Domingo"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com horário de fim anterior ao de início", async () => {
    const response = await request(app)
      .post("/promotions")
      .send({
        product_id: 1,
        description: "Promoção com horários inválidos",
        promotional_price: 39.9,
        start_time: "22:00",
        end_time: "18:00",
        days: ["Sábado", "Domingo"],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com horários fora do formato", async () => {
    const response = await request(app)
      .post("/promotions")
      .send({
        product_id: 1,
        description: "Promoção com horários inválidos",
        promotional_price: 39.9,
        start_time: "18:05",
        end_time: "22:00",
        days: ["Sábado", "Domingo"],
      });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção sem dias especificados", async () => {
    const response = await request(app).post("/promotions").send({
      product_id: 1,
      description: "Promoção sem dias",
      promotional_price: 39.9,
      start_time: "18:00",
      end_time: "22:00",
      days: [],
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve validar schema e retornar erro com dados inválidos", async () => {
    const response = await request(app).post("/promotions").send({
      product_id: 1,
      description: "Promoção incompleta",
    });

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(promotionRepository.items).toHaveLength(0);
  });
});
