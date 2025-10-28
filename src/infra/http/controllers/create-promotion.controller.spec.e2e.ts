import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { makeCreatePromotionUseCase } from "@/infra/factories/promotion/create/make-create-promotion-use-case";
import { CreatePromotionController } from "@/infra/http/controllers/create-promotion.controller";
import { CreatePromotionUseCase } from "@/domain/application/use-cases/create-promotion.use-case";
import { makeMockRequest, makeMockResponse } from "@test/utils/mock-express";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("CreatePromotionController (E2E)", () => {
  let promotionRepository: InMemoryPromotionRepository;
  let productRepository: InMemoryProductRepository;
  let controller: CreatePromotionController;
  let productId: string;

  beforeEach(async () => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();

    const useCase = new CreatePromotionUseCase(
      promotionRepository,
      productRepository
    );
    controller = new CreatePromotionController(useCase);

    // Cria um produto válido para usar nas promoções
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
    const req = makeMockRequest({
      product_id: 1,
      description: "Promoção de fim de semana",
      promotional_price: 39.9,
      start_time: "18:00",
      end_time: "22:00",
      days: ["Sábado", "Domingo"],
    });

    const { res, getStatus, getBody } = makeMockResponse();

    await controller.create(req as any, res);

    expect(getStatus()).toBe(201);
    expect(getBody().promotion).toBeDefined();
    expect(getBody().promotion.description).toBe("Promoção de fim de semana");
    expect(getBody().promotion.promotional_price).toBe(39.9);
    expect(promotionRepository.items).toHaveLength(1);
  });

  it("deve retornar erro ao criar promoção com productId inválido", async () => {
    const req = makeMockRequest({
      product_id: 999999, // ID que não existe
      description: "Promoção inválida",
      promotional_price: 39.9,
      start_time: "18:00",
      end_time: "22:00",
      days: ["Sábado", "Domingo"],
    });

    const { res, getStatus, getBody } = makeMockResponse();

    await controller.create(req as any, res);

    expect(getStatus()).toBe(404);
    expect(getBody().message).toBe("Product not found");
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com preço maior que o produto", async () => {
    const req = makeMockRequest({
      product_id: 1,
      description: "Promoção inválida",
      promotional_price: 100.0, // Maior que o preço do produto (45.9)
      start_time: "18:00",
      end_time: "22:00",
      days: ["Sábado", "Domingo"],
    });

    const { res, getStatus, getBody } = makeMockResponse();

    await controller.create(req as any, res);

    expect(getStatus()).toBe(400);
    expect(getBody().message).toBeDefined();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com horário de fim anterior ao de início", async () => {
    const req = makeMockRequest({
      product_id: 1,
      description: "Promoção com horários inválidos",
      promotional_price: 39.9,
      start_time: "22:00",
      end_time: "18:00", // Horário de fim antes do início
      days: ["Sábado", "Domingo"],
    });

    const { res, getStatus, getBody } = makeMockResponse();

    await controller.create(req as any, res);

    expect(getStatus()).toBe(400);
    expect(getBody().message).toBeDefined();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção com horários fora do formato", async () => {
    const req = makeMockRequest({
      product_id: 1,
      description: "Promoção com horários inválidos",
      promotional_price: 39.9,
      start_time: "18:05", // Não é múltiplo de 15 minutos
      end_time: "22:00",
      days: ["Sábado", "Domingo"],
    });

    const { res, getStatus } = makeMockResponse();

    await expect(controller.create(req as any, res)).rejects.toThrow();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve retornar erro ao criar promoção sem dias especificados", async () => {
    const req = makeMockRequest({
      product_id: 1,
      description: "Promoção sem dias",
      promotional_price: 39.9,
      start_time: "18:00",
      end_time: "22:00",
      days: [], // Array vazio não é permitido
    });

    const { res } = makeMockResponse();

    await expect(controller.create(req as any, res)).rejects.toThrow();
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("deve validar schema e retornar erro com dados inválidos", async () => {
    const req = makeMockRequest({
      product_id: 1,
      // Faltando campos obrigatórios
      description: "Promoção incompleta",
    });

    const { res } = makeMockResponse();

    await expect(controller.create(req as any, res)).rejects.toThrow();
    expect(promotionRepository.items).toHaveLength(0);
  });
});
