import { describe, it, expect, beforeEach } from "vitest";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { ListProductsUseCase } from "./list-products.use-case";

let productRepository: InMemoryProductRepository;
let sut: ListProductsUseCase;

describe("ListProductsUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    sut = new ListProductsUseCase(productRepository);
  });

  it("deve listar todos os produtos", async () => {
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
        name: "Bruschetta",
        price: 15.0,
        category: "Entradas",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await productRepository.create(product1);
    await productRepository.create(product2);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
      expect(result.value.products).toContain(product1);
      expect(result.value.products).toContain(product2);
    }
  });

  it("deve retornar erro quando não houver produtos", async () => {
    const result = await sut.execute();

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve listar produtos visíveis e invisíveis", async () => {
    const visibleProduct = Product.create(
      {
        name: "Pizza Visível",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const invisibleProduct = Product.create(
      {
        name: "Pizza Invisível",
        price: 50.0,
        category: "Pratos principais",
        visible: false,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await productRepository.create(visibleProduct);
    await productRepository.create(invisibleProduct);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2);
    }
  });

  it("deve listar produtos de diferentes categorias", async () => {
    const entrada = Product.create(
      {
        name: "Bruschetta",
        price: 15.0,
        category: "Entradas",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const prato = Product.create(
      {
        name: "Pizza",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    const sobremesa = Product.create(
      {
        name: "Tiramisu",
        price: 18.0,
        category: "Sobremesas",
        visible: true,
        order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("3")
    );

    const bebida = Product.create(
      {
        name: "Refrigerante",
        price: 7.5,
        category: "Bebidas",
        visible: true,
        order: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("4")
    );

    await productRepository.create(entrada);
    await productRepository.create(prato);
    await productRepository.create(sobremesa);
    await productRepository.create(bebida);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.products).toHaveLength(4);

      const categories = result.value.products.map((p) => p.category);
      expect(categories).toContain("Entradas");
      expect(categories).toContain("Pratos principais");
      expect(categories).toContain("Sobremesas");
      expect(categories).toContain("Bebidas");
    }
  });
});
