import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { ShowProductUseCase } from "@/domain/application/use-cases/show-product.use-case";
import { ShowProductController } from "@/infra/http/controllers/show-product.controller";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductPresenter } from "@/infra/http/presenters/product.presenter";

import express, { Request, Response, NextFunction } from "express";
import request from "supertest";
import { describe, beforeEach, afterEach, it, expect, vi } from "vitest";

const app = express();
app.use(express.json());

describe("ShowProductController (E2E com supertest)", () => {
  let repository: InMemoryProductRepository;
  let controller: ShowProductController;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    const useCase = new ShowProductUseCase(repository);
    controller = new ShowProductController(useCase);

    app.get(
      "/products/:id",
      async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
      ) => {
        try {
          await controller.show(req, res);
        } catch (error) {
          next(error);
        }
      }
    );

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
    const response = await request(app).get("/products/1").expect(200);

    const product = response.body.product;

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
    const response = await request(app).get("/products/999").expect(404);

    expect(response.body.message).toBe("Product not found");
  });

  it("deve retornar 500 para erros inesperados", async () => {
    vi.spyOn(ShowProductUseCase.prototype, "execute").mockRejectedValueOnce(
      new Error("DB error")
    );

    const response = await request(app).get("/products/1").expect(500);

    expect(response.body.message).toBe("Internal server error");
  });

  it("deve formatar datas como ISO string via ProductPresenter", async () => {
    const response = await request(app).get("/products/1").expect(200);

    const { product } = response.body;

    expect(typeof product.created_at).toBe("string");
    expect(typeof product.updated_at).toBe("string");
    expect(product.created_at).toBe("2025-10-27T10:00:00.000Z");
    expect(product.updated_at).toBe("2025-10-27T10:00:00.000Z");
  });
});
