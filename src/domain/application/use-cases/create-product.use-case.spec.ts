import { describe, it, expect, beforeEach } from "vitest";
import { ProductAlreadyExistsError } from "@/domain/application/use-cases/errors/product-already-exists.error";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { CreateProductUseCase } from "./create-product.use-case";

let productRepository: InMemoryProductRepository;
let sut: CreateProductUseCase;

describe("CreateProductUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    sut = new CreateProductUseCase(productRepository);
  });

  it("deve ser possível criar um produto", async () => {
    const result = await sut.execute({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.name).toBe("Pizza Margherita");
      expect(result.value.product.price).toBe(45.9);
      expect(result.value.product.category).toBe("Pratos principais");
      expect(result.value.product.visible).toBe(true);
      expect(result.value.product.order).toBe(1);
    }

    expect(productRepository.items).toHaveLength(1);
  });

  it("não deve ser possível criar um produto com nome duplicado", async () => {
    await sut.execute({
      name: "Pizza Margherita",
      price: 45.9,
      category: "Pratos principais",
      visible: true,
      order: 1,
    });

    const result = await sut.execute({
      name: "Pizza Margherita",
      price: 50.0,
      category: "Pratos principais",
      visible: true,
      order: 2,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ProductAlreadyExistsError);
    expect(productRepository.items).toHaveLength(1); // Só deve ter 1 produto
  });

  it("deve criar produtos com diferentes categorias", async () => {
    const categories = [
      "Entradas",
      "Pratos principais",
      "Sobremesas",
      "Bebidas",
    ] as const;

    for (const category of categories) {
      const result = await sut.execute({
        name: `Produto ${category}`,
        price: 10.0,
        category,
        visible: true,
        order: 1,
      });

      expect(result.isRight()).toBe(true);
      if (result.isRight()) {
        expect(result.value.product.category).toBe(category);
      }
    }

    expect(productRepository.items).toHaveLength(4);
  });

  it("deve criar produto invisível", async () => {
    const result = await sut.execute({
      name: "Produto Oculto",
      price: 20.0,
      category: "Entradas",
      visible: false,
      order: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.visible).toBe(false);
    }
  });

  it("deve criar produto com preço decimal", async () => {
    const result = await sut.execute({
      name: "Refrigerante",
      price: 7.5,
      category: "Bebidas",
      visible: true,
      order: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.price).toBe(7.5);
    }
  });

  it("deve criar produto com ordem específica", async () => {
    const result = await sut.execute({
      name: "Sobremesa Especial",
      price: 15.0,
      category: "Sobremesas",
      visible: true,
      order: 5,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.order).toBe(5);
    }
  });

  it("deve definir created_at e updated_at ao criar produto", async () => {
    const result = await sut.execute({
      name: "Produto Teste",
      price: 10.0,
      category: "Entradas",
      visible: true,
      order: 1,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.created_at).toBeInstanceOf(Date);
      expect(result.value.product.updated_at).toBeInstanceOf(Date);
    }
  });

  it("deve permitir criar múltiplos produtos com nomes diferentes", async () => {
    const produtos = [
      "Pizza Margherita",
      "Pizza Calabresa",
      "Pizza Portuguesa",
    ];

    for (const nome of produtos) {
      const result = await sut.execute({
        name: nome,
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
      });

      expect(result.isRight()).toBe(true);
    }

    expect(productRepository.items).toHaveLength(3);
  });
});
