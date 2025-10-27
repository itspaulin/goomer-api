import { describe, it, expect, beforeEach } from "vitest";
import { Product } from "@/domain/enterprise/entities/product";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { NotFoundError } from "@/domain/application/use-cases/errors/not-found.error";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { ShowProductUseCase } from "./show-product.use-case";

let productRepository: InMemoryProductRepository;
let sut: ShowProductUseCase;

describe("ShowProductUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    sut = new ShowProductUseCase(productRepository);
  });

  it("deve exibir um produto por ID", async () => {
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
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.id.toString()).toBe("1");
      expect(result.value.product.name).toBe("Pizza Margherita");
      expect(result.value.product.price).toBe(45.9);
      expect(result.value.product.category).toBe("Pratos principais");
    }
  });

  it("deve retornar erro quando produto não existir", async () => {
    const result = await sut.execute({
      id: "999",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotFoundError);
  });

  it("deve exibir produto invisível", async () => {
    const product = Product.create(
      {
        name: "Pizza Oculta",
        price: 50.0,
        category: "Pratos principais",
        visible: false,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.product.visible).toBe(false);
    }
  });

  it("deve exibir produto com todas as propriedades corretas", async () => {
    const product = Product.create(
      {
        name: "Tiramisu",
        price: 18.5,
        category: "Sobremesas",
        visible: true,
        order: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);

    const result = await sut.execute({
      id: "1",
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const { product: foundProduct } = result.value;

      expect(foundProduct.name).toBe("Tiramisu");
      expect(foundProduct.price).toBe(18.5);
      expect(foundProduct.category).toBe("Sobremesas");
      expect(foundProduct.visible).toBe(true);
      expect(foundProduct.order).toBe(5);
      expect(foundProduct.created_at).toBeInstanceOf(Date);
      expect(foundProduct.updated_at).toBeInstanceOf(Date);
    }
  });
});
