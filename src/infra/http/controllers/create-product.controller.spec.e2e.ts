import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { makeCreateProductUseCase } from "@/infra/factories/product/create/make-create-product-use-case";
import { CreateProductController } from "@/infra/http/controllers/create-product.controller";

describe("CreateProductController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let app: Express;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    const useCase = makeCreateProductUseCase(repository);
    const controller = new CreateProductController(useCase);

    app = express();
    app.use(express.json());
    app.post("/products", (req, res) => controller.create(req, res));
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve criar um produto com sucesso", async () => {
    const response = await request(app).post("/products").send({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    expect(response.status).toBe(201);
    expect(response.body.product).toBeDefined();
    expect(response.body.product.name).toBe("Pizza Margherita");
    expect(repository.items).toHaveLength(1);
  });

  it("deve retornar 409 ao tentar criar produto com nome duplicado", async () => {
    await request(app).post("/products").send({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    const response = await request(app).post("/products").send({
      name: "Pizza Margherita",
      price: 50.0,
      category: "Pratos principais",
      visible: true,
      order: 2,
    });

    expect(response.status).toBe(409);
    expect(response.body.message).toContain("already exists");
    expect(repository.items).toHaveLength(1);
  });
});
