import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { UpdateProductUseCase } from "@/domain/application/use-cases/update-product.use-case";
import { UpdateProductController } from "@/infra/http/controllers/update-product.controller";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { ProductPresenter } from "@/infra/http/presenters/product.presenter";

describe("UpdateProductController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let app: Express;
  let controller: UpdateProductController;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    const useCase = new UpdateProductUseCase(repository);
    controller = new UpdateProductController(useCase);

    app = express();
    app.use(express.json());

    // Rota PATCH /products/:id
    app.patch("/products/:id", async (req: any, res: any, next: any) => {
      try {
        await controller.update(req, res);
      } catch (error) {
        next(error);
      }
    });

    // Middleware de tratamento de erros do Zod
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

    // Produto inicial
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

  it("deve atualizar o produto com sucesso", async () => {
    const updateData = {
      name: "Pizza Calabresa",
      price: 49.9,
      visible: false,
    };
    const response = await request(app)
      .patch("/products/1")
      .send(updateData)
      .expect(200);
    const { product } = response.body;
    expect(product).toMatchObject({
      id: "1",
      name: "Pizza Calabresa",
      price: 49.9,
      category: "Pratos principais",
      visible: false,
      order: 1,
    });
    expect(new Date(product.updated_at).getTime()).toBeGreaterThan(
      new Date("2025-10-27T10:00:00Z").getTime()
    );
    expect(product.created_at).toBe("2025-10-27T10:00:00.000Z");
    const updatedInRepo = await repository.findById("1");
    expect(updatedInRepo?.name).toBe("Pizza Calabresa");
    expect(updatedInRepo?.price).toBe(49.9);
    expect(updatedInRepo?.visible).toBe(false);
  });

  it("deve permitir atualização parcial", async () => {
    const response = await request(app)
      .patch("/products/1")
      .send({ price: 52.0 })
      .expect(200);

    const { product } = response.body;

    expect(product.name).toBe("Pizza Margherita");
    expect(product.price).toBe(52.0);
    expect(product.visible).toBe(true);
  });

  it("deve retornar 404 se o produto não existir", async () => {
    const response = await request(app)
      .patch("/products/999")
      .send({ name: "Inexistente" })
      .expect(404);

    expect(response.body.message).toBe("Product not found");
  });

  it("deve retornar 400 para dados inválidos (Zod)", async () => {
    const response = await request(app)
      .patch("/products/1")
      .send({
        price: -10,
        category: "Invalid",
        name: "",
      })
      .expect(400); // Zod lança antes do controller

    expect(response.body).toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ message: "Price must be positive" }),
        expect.objectContaining({ message: "Invalid category" }),
        expect.objectContaining({ message: "Name is required" }),
      ]),
    });
  });

  it("deve retornar 500 em caso de erro interno", async () => {
    vi.spyOn(UpdateProductUseCase.prototype, "execute").mockRejectedValueOnce(
      new Error("Database connection failed")
    );

    const response = await request(app)
      .patch("/products/1")
      .send({ price: 50 })
      .expect(500);

    expect(response.body.message).toBe("Internal server error");
  });

  it("deve formatar o produto via ProductPresenter", async () => {
    const response = await request(app)
      .patch("/products/1")
      .send({ name: "Pizza Quatro Queijos" })
      .expect(200);

    const { product } = response.body;

    expect(product).toEqual(
      ProductPresenter.toHTTP(
        repository.items.find((p) => p.id.toString() === "1")!
      )
    );

    expect(typeof product.created_at).toBe("string");
    expect(typeof product.updated_at).toBe("string");
    expect(product.created_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
    );
  });

  it("deve manter campos não enviados inalterados", async () => {
    await request(app).patch("/products/1").send({}).expect(200);

    const updated = await repository.findById("1");
    expect(updated?.name).toBe("Pizza Margherita");
    expect(updated?.price).toBe(45.9);
    expect(updated?.category).toBe("Pratos principais");
  });
});
