import { describe, it, expect, beforeEach } from "vitest";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { DeleteProductUseCase } from "./delete-product.use-case";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";

let productRepository: InMemoryProductRepository;
let sut: DeleteProductUseCase;

describe("DeleteProductUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    sut = new DeleteProductUseCase(productRepository);
  });

  it("deve ser possível deletar um produto", async () => {
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

    expect(productRepository.items).toHaveLength(1);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.message).toBe("Product deleted successfully");
    }

    expect(productRepository.items).toHaveLength(0);
  });

  it("não deve ser possível deletar um produto inexistente", async () => {
    const result = await sut.execute({
      id: "999",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve deletar apenas o produto especificado", async () => {
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
        name: "Pizza Calabresa",
        price: 40.0,
        category: "Pratos principais",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await productRepository.create(product1);
    await productRepository.create(product2);

    expect(productRepository.items).toHaveLength(2);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);
    expect(productRepository.items).toHaveLength(1);

    const remainingProduct = productRepository.items[0];
    expect(remainingProduct).toBeDefined();
    expect(remainingProduct?.id.toString()).toBe("2");
  });

  it("deve permitir deletar múltiplos produtos em sequência", async () => {
    const product1 = Product.create(
      {
        name: "Pizza 1",
        price: 40.0,
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
        name: "Pizza 2",
        price: 45.0,
        category: "Pratos principais",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    await productRepository.create(product1);
    await productRepository.create(product2);

    const result1 = await sut.execute({ id: "1" });
    expect(result1.isRight()).toBe(true);
    expect(productRepository.items).toHaveLength(1);

    const result2 = await sut.execute({ id: "2" });
    expect(result2.isRight()).toBe(true);
    expect(productRepository.items).toHaveLength(0);
  });
});
