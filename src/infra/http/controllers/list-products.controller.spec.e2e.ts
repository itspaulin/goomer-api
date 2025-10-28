import request from "supertest";
import express, { Express } from "express";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { ListProductsUseCase } from "@/domain/application/use-cases/list-products.use-case";
import { ListProductsController } from "@/infra/http/controllers/list-products.controller";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

describe("ListProductsController (E2E)", () => {
  let repository: InMemoryProductRepository;
  let app: Express;

  beforeEach(async () => {
    repository = new InMemoryProductRepository();
    const useCase = new ListProductsUseCase(repository);
    const controller = new ListProductsController(useCase);

    app = express();
    app.use(express.json());
    app.get("/products", (req, res) => controller.list(res));

    const pizza = Product.create(
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

    const coca = Product.create(
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

    const interno = Product.create(
      {
        name: "Ingrediente Interno",
        price: 100,
        category: "Entradas",
        visible: false,
        order: 99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("3")
    );

    await repository.create(pizza);
    await repository.create(coca);
    await repository.create(interno);
  });

  afterEach(() => {
    repository.items = [];
  });

  it("deve listar todos os produtos (visíveis ou não)", async () => {
    const response = await request(app).get("/products");

    expect(response.status).toBe(200);
    const { products } = response.body;

    expect(products).toHaveLength(3);
    expect(products.map((p: any) => p.id)).toEqual(
      expect.arrayContaining(["1", "2", "3"])
    );

    const interno = products.find((p: any) => p.id === "3");
    expect(interno).toBeDefined();
    expect(interno.visible).toBe(false);
    expect(interno.name).toBe("Ingrediente Interno");
  });

  it("deve retornar 404 se não houver nenhum produto", async () => {
    repository.items = [];

    const response = await request(app).get("/products");

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No products found");
  });

  it("deve formatar a resposta com ProductPresenter.toHTTPList", async () => {
    const response = await request(app).get("/products");

    const { products } = response.body;

    expect(products).toHaveLength(3);

    products.forEach((product: any) => {
      expect(product).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          price: expect.any(Number),
          category: expect.any(String),
          visible: expect.any(Boolean),
          order: expect.any(Number),
        })
      );

      expect(typeof product.created_at).toBe("string");
      expect(() => new Date(product.created_at)).not.toThrow();
      expect(product.created_at).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
      );

      if (product.updated_at !== null) {
        expect(typeof product.updated_at).toBe("string");
        expect(() => new Date(product.updated_at)).not.toThrow();
      } else {
        expect(product.updated_at).toBeNull();
      }
    });
  });

  it("deve manter a ordem de inserção (ou ordem do repositório)", async () => {
    const response = await request(app).get("/products");

    const { products } = response.body;

    expect(products[0].id).toBe("1");
    expect(products[1].id).toBe("2");
    expect(products[2].id).toBe("3");
  });
});
