import { describe, it, expect, beforeEach } from "vitest";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { BadRequestError } from "@/domain/application/use-cases/errors/bad-request.error";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { UpdatePromotionUseCase } from "./update-promotion.use-case";

let promotionRepository: InMemoryPromotionRepository;
let productRepository: InMemoryProductRepository;
let sut: UpdatePromotionUseCase;
let testProduct: Product;

describe("UpdatePromotionUseCase", () => {
  beforeEach(async () => {
    promotionRepository = new InMemoryPromotionRepository();
    productRepository = new InMemoryProductRepository();
    sut = new UpdatePromotionUseCase(promotionRepository, productRepository);

    testProduct = Product.create(
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
    await productRepository.create(testProduct);
  });

  it("deve atualizar uma promoção", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      description: "Super Happy Hour",
      promotional_price: 19.9,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.description).toBe("Super Happy Hour");
      expect(result.value.promotion.promotional_price).toBe(19.9);
      expect(result.value.promotion.days).toEqual(["monday"]);
    }
  });

  it("não deve atualizar promoção inexistente", async () => {
    const result = await sut.execute({
      id: "999",
      description: "Promoção Inexistente",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve atualizar apenas os campos fornecidos", async () => {
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

    const result = await sut.execute({
      id: "1",
      promotional_price: 25.0,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.description).toBe("Happy Hour");
      expect(result.value.promotion.promotional_price).toBe(25.0);
      expect(result.value.promotion.days).toEqual(["monday", "wednesday"]);
    }
  });

  it("deve atualizar os dias da promoção", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      days: ["monday", "wednesday", "friday"],
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.days).toEqual([
        "monday",
        "wednesday",
        "friday",
      ]);
    }
  });

  it("deve atualizar ambos os horários", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      start_time: "17:00",
      end_time: "21:00",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.promotion.start_time).toBe("17:00");
      expect(result.value.promotion.end_time).toBe("21:00");
    }
  });

  it("não deve atualizar com horário inicial inválido", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      start_time: "18:05",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar com horário final inválido", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      end_time: "20:07",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar com horário final anterior ao inicial", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      start_time: "21:00",
      end_time: "19:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar com horário final igual ao inicial", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      start_time: "19:00",
      end_time: "19:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar start_time para após o end_time existente", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      start_time: "21:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar end_time para antes do start_time existente", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      end_time: "17:00",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(BadRequestError);
  });

  it("não deve atualizar product_id para produto inexistente", async () => {
    const promotion = Promotion.create(
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

    await promotionRepository.create(promotion);

    const result = await sut.execute({
      id: "1",
      product_id: 999,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });
});
