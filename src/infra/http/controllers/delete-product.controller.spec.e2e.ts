import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { DeleteProductUseCase } from "@/domain/application/use-cases/delete-product.use-case";
import { DeleteProductController } from "@/infra/http/controllers/delete-product.controller";
import { makeMockRequest, makeMockResponse } from "@test/utils/mock-express";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("DeleteProductController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let controller: DeleteProductController;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    const useCase = new DeleteProductUseCase(repository);
    controller = new DeleteProductController(useCase);

    const product1 = Product.create(
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

    const product2 = Product.create(
      {
        name: "Coca-Cola",
        price: 5.0,
        category: "Bebidas",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await repository.create(product1);
    await repository.create(product2);
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve deletar um produto com sucesso", async () => {
    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(200);
    expect(getBody().message).toBeDefined();
    expect(repository.items).toHaveLength(1);
    expect(repository.items![0]!.id.toString()).toBe("2");
  });

  it("deve retornar 404 ao tentar deletar produto inexistente", async () => {
    const req = makeMockRequest({}, { id: "999" });
    const { res, getStatus, getBody } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(404);
    expect(getBody().message).toBeDefined();
    expect(repository.items).toHaveLength(2);
  });

  it("deve manter outros produtos ao deletar um específico", async () => {
    const initialCount = repository.items.length;

    const req = makeMockRequest({}, { id: "1" });
    const { res, getStatus } = makeMockResponse();

    await controller.delete(req as any, res);

    expect(getStatus()).toBe(200);
    expect(repository.items).toHaveLength(initialCount - 1);

    const remainingProduct = repository.items[0];
    expect(remainingProduct?.id.toString()).toBe("2");
    expect(remainingProduct?.name).toBe("Coca-Cola");
  });
});
