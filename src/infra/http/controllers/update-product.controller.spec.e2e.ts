import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { ShowProductUseCase } from "@/domain/application/use-cases/show-product.use-case";
import { ShowProductController } from "@/infra/http/controllers/show-product.controller";
import { makeMockRequest, makeMockResponse } from "@test/utils/mock-express";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductPresenter } from "@/infra/http/presenters/product.presenter";

describe("ShowProductController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let useCase: ShowProductUseCase;
  let controller: ShowProductController;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    useCase = new ShowProductUseCase(repository);
    controller = new ShowProductController(useCase);

    const product = Product.create(
      {
        name: "Pizza Margherita",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date("2025-10-27T10:00:00Z"),
        updated_at: new Date("2025-10-27T10:00:00Z"),
      },
      new UniqueEntityId("1")
    );

    await repository.create(product);
  });

  afterEach(() => {
    repository.items = [];
    vi.restoreAllMocks();
  });

  it("deve retornar o produto com sucesso", async () => {
    const req = makeMockRequest(
      {
        description: "Promo atualizada",
        promotional_price: 29.9,
        days: ["Segunda"],
        start_time: "18:00",
        end_time: "22:00",
      },
      { id: "1" }
    );
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.show(req as any, res);

    expect(getStatus()).toBe(200);
    const { product } = getBody();

    expect(product).toEqual(
      ProductPresenter.toHTTPList([repository.items[0]!])[0]
    );

    expect(product).toMatchObject({
      id: "1",
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    expect(product.created_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
    expect(product.updated_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("deve retornar 404 se o produto não existir", async () => {
    const req = makeMockRequest({}, { id: "999" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.show(req as any, res);

    expect(getStatus()).toBe(404);
    expect(getBody().message).toBe("Product not found");
  });

  it("deve retornar 500 para erros inesperados", async () => {
    vi.spyOn(repository, "findById").mockRejectedValueOnce(
      new Error("DB error")
    );

    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.show(req as any, res);

    expect(getStatus()).toBe(500);
    expect(getBody().message).toBe("Internal server error");
  });

  it("deve formatar datas como ISO string via ProductPresenter", async () => {
    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.show(req as any, res);

    const { product } = getBody();

    expect(typeof product.created_at).toBe("string");
    expect(typeof product.updated_at).toBe("string");
    expect(product.created_at).toBe("2025-10-27T10:00:00.000Z");
    expect(product.updated_at).toBe("2025-10-27T10:00:00.000Z");
  });
});
