import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { makeCreateProductUseCase } from "@/infra/factories/product/create/make-create-product-use-case";
import { CreateProductController } from "@/infra/http/controllers/create-product.controller";
import { makeMockRequest, makeMockResponse } from "@test/utils/mock-express";

describe("CreateProductController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let controller: CreateProductController;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    const useCase = makeCreateProductUseCase(repository);
    controller = new CreateProductController(useCase);
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve criar um produto com sucesso", async () => {
    const req = makeMockRequest({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    const { res, getStatus, getBody } = makeMockResponse();

    await controller.create(req as any, res);

    expect(getStatus()).toBe(201);
    expect(getBody().product).toBeDefined();
    expect(getBody().product.name).toBe("Pizza Margherita");
    expect(repository.items).toHaveLength(1);
  });

  it("deve retornar 409 ao tentar criar produto com nome duplicado", async () => {
    const req1 = makeMockRequest({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    const { res: res1 } = makeMockResponse();
    await controller.create(req1 as any, res1);

    const req2 = makeMockRequest({
      name: "Pizza Margherita",
      price: 50.0,
      category: "Pratos principais",
      visible: true,
      order: 2,
    });

    const { res: res2, getStatus, getBody } = makeMockResponse();
    await controller.create(req2 as any, res2);

    expect(getStatus()).toBe(409);
    expect(getBody().message).toContain("already exists");
    expect(repository.items).toHaveLength(1);
  });
});
