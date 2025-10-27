import { describe, it, expect, beforeEach } from "vitest";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { UpdateProductUseCase } from "./update-product.use-case";

let productRepository: InMemoryProductRepository;
let sut: UpdateProductUseCase;

describe("UpdateProductUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    sut = new UpdateProductUseCase(productRepository);
  });

  it("deve atualizar um produto", async () => {
    const product = Product.create(
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

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      name: "Pizza Margherita Premium",
      price: 55.9,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.name).toBe("Pizza Margherita Premium");
      expect(result.value.product.price).toBe(55.9);
      expect(result.value.product.category).toBe("Pratos principais");
    }
  });

  it("não deve atualizar produto inexistente", async () => {
    const result = await sut.execute({
      id: "999",
      name: "Produto Inexistente",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve atualizar apenas os campos fornecidos", async () => {
    const product = Product.create(
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

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      price: 50.0,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.name).toBe("Pizza Margherita");
      expect(result.value.product.price).toBe(50.0);
      expect(result.value.product.category).toBe("Pratos principais");
    }
  });

  it("deve atualizar a categoria do produto", async () => {
    const product = Product.create(
      {
        name: "Item",
        price: 20.0,
        category: "Entradas",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      category: "Pratos principais",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.category).toBe("Pratos principais");
    }
  });

  it("deve atualizar a visibilidade do produto", async () => {
    const product = Product.create(
      {
        name: "Pizza",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      visible: false,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.visible).toBe(false);
    }
  });

  it("deve atualizar a ordem do produto", async () => {
    const product = Product.create(
      {
        name: "Pizza",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      order: 5,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.order).toBe(5);
    }
  });

  it("deve atualizar múltiplos campos ao mesmo tempo", async () => {
    const product = Product.create(
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

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
      name: "Pizza Especial",
      price: 60.0,
      category: "Sobremesas",
      visible: false,
      order: 10,
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.name).toBe("Pizza Especial");
      expect(result.value.product.price).toBe(60.0);
      expect(result.value.product.category).toBe("Sobremesas");
      expect(result.value.product.visible).toBe(false);
      expect(result.value.product.order).toBe(10);
    }
  });
});
