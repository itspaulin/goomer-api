import { describe, it, expect, beforeEach } from "vitest";
import { Product } from "@/domain/enterprise/entities/product";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { CreatePromotionUseCase } from "./create-promotion.use-case";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

let promotionRepository: InMemoryPromotionRepository;
let productRepository: InMemoryProductRepository;
let sut: CreatePromotionUseCase;

describe("CreatePromotionUseCase", () => {
  beforeEach(() => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();
    sut = new CreatePromotionUseCase(promotionRepository, productRepository);
  });

  it("deve ser possível criar uma promoção", async () => {
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

    const result = await sut.execute({
      product_id: 1,
      description: "Happy Hour - 50% de desconto",
      promotional_price: 22.95,
      days: ["monday", "wednesday", "friday"],
      start_time: "18:00",
      end_time: "20:00",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.description).toBe(
        "Happy Hour - 50% de desconto"
      );
      expect(result.value.promotion.promotional_price).toBe(22.95);
      expect(result.value.promotion.days).toEqual([
        "monday",
        "wednesday",
        "friday",
      ]);
      expect(result.value.promotion.start_time).toBe("18:00");
      expect(result.value.promotion.end_time).toBe("20:00");
    }

    expect(promotionRepository.items).toHaveLength(1);
  });

  it("não deve criar promoção para produto inexistente", async () => {
    const result = await sut.execute({
      product_id: 999,
      description: "Promoção inválida",
      promotional_price: 10.0,
      days: ["monday"],
      start_time: "18:00",
      end_time: "20:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("não deve criar promoção com horário inicial inválido", async () => {
    const product = Product.create({
      name: "Pizza",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await productRepository.create(product);

    const result = await sut.execute({
      product_id: parseInt(product.id.toString()),
      description: "Promoção",
      promotional_price: 22.95,
      days: ["monday"],
      start_time: "18:05",
      end_time: "20:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("não deve criar promoção com horário final inválido", async () => {
    const product = Product.create({
      name: "Pizza",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await productRepository.create(product);

    const result = await sut.execute({
      product_id: parseInt(product.id.toString()),
      description: "Promoção",
      promotional_price: 22.95,
      days: ["monday"],
      start_time: "18:00",
      end_time: "20:07",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
    expect(promotionRepository.items).toHaveLength(0);
  });

  it("não deve criar promoção com formato de horário inválido", async () => {
    const product = Product.create({
      name: "Pizza",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await productRepository.create(product);

    const result = await sut.execute({
      product_id: parseInt(product.id.toString()),
      description: "Promoção",
      promotional_price: 22.95,
      days: ["monday"],
      start_time: "25:00",
      end_time: "20:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve criar promoção com horário final anterior ao inicial", async () => {
    const product = Product.create({
      name: "Pizza",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await productRepository.create(product);

    const result = await sut.execute({
      product_id: parseInt(product.id.toString()),
      description: "Promoção",
      promotional_price: 22.95,
      days: ["monday"],
      start_time: "20:00",
      end_time: "18:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve criar promoção com horário final igual ao inicial", async () => {
    const product = Product.create({
      name: "Pizza",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });
    await productRepository.create(product);

    const result = await sut.execute({
      product_id: parseInt(product.id.toString()),
      description: "Promoção",
      promotional_price: 22.95,
      days: ["monday"],
      start_time: "18:00",
      end_time: "18:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("deve aceitar todos os múltiplos de 15 minutos", async () => {
    const product = Product.create(
      {
        name: "Pizza",
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

    const horariosValidos = ["18:00", "18:15", "18:30", "18:45"];

    for (const horario of horariosValidos) {
      const result = await sut.execute({
        product_id: 1,
        description: `Promoção ${horario}`,
        promotional_price: 22.95,
        days: ["monday"],
        start_time: horario,
        end_time: "20:00",
      });

      expect(result.isRight()).toBe(true);
    }

    expect(promotionRepository.items).toHaveLength(4);
  });

  it("deve criar promoção com múltiplos dias da semana", async () => {
    const product = Product.create(
      {
        name: "Pizza",
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

    const result = await sut.execute({
      product_id: 1,
      description: "Promoção semanal",
      promotional_price: 22.95,
      days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      start_time: "18:00",
      end_time: "20:00",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.days).toHaveLength(5);
    }
  });
});
