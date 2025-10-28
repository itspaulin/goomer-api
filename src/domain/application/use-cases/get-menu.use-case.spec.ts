import { Product } from "@/domain/enterprise/entities/product";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { GetMenuUseCase } from "./get-menu.use-case";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { DateTimeProvider } from "../providers/datetime-provider";

let productRepository: InMemoryProductRepository;
let promotionRepository: InMemoryPromotionRepository;
let dateTimeProvider: DateTimeProvider;
let sut: GetMenuUseCase;

describe("GetMenuUseCase", () => {
  beforeEach(() => {
    productRepository = new InMemoryProductRepository();
    promotionRepository = new InMemoryPromotionRepository();

    dateTimeProvider = {
      getCurrentDay: vi.fn(),
      getCurrentTime: vi.fn(),
      formatDateTime: vi.fn(),
    };

    sut = new GetMenuUseCase(
      productRepository,
      promotionRepository,
      dateTimeProvider
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deve retornar apenas produtos visíveis no cardápio", async () => {
    const visibleProduct = Product.create(
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

    const invisibleProduct = Product.create(
      {
        name: "Pizza Oculta",
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
      const allProducts = result.value.menu.flatMap(
        (category) => category.products
      );
      expect(allProducts).toHaveLength(1);
      expect(allProducts[0]?.name).toBe("Pizza Margherita");
    }
  });

  it("deve agrupar produtos por categoria", async () => {
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
        name: "Pizza Margherita",
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

    await productRepository.create(entrada);
    await productRepository.create(prato);
    await productRepository.create(sobremesa);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.menu).toHaveLength(3);

      const categories = result.value.menu.map((cat) => cat.category);
      expect(categories).toContain("Entradas");
      expect(categories).toContain("Pratos principais");
      expect(categories).toContain("Sobremesas");
    }
  });

  it("deve aplicar promoção ativa no horário e dia corretos", async () => {
    (dateTimeProvider.getCurrentDay as any).mockReturnValue("monday");
    (dateTimeProvider.getCurrentTime as any).mockReturnValue("19:00");

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

    const promotion = Promotion.create(
      {
        product_id: 1,
        description: "Happy Hour - 50% off",
        promotional_price: 22.95,
        days: ["monday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);
    await promotionRepository.create(promotion);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const products = result.value.menu[0]?.products;
      expect(products![0]!.promotional_price).toBe(22.95);
      expect(products![0]!.promotion?.active).toBe(true);
    }
  });

  it("não deve aplicar promoção fora do horário", async () => {
    (dateTimeProvider.getCurrentDay as any).mockReturnValue("monday");
    (dateTimeProvider.getCurrentTime as any).mockReturnValue("21:00");

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

    const promotion = Promotion.create(
      {
        product_id: 1,
        description: "Happy Hour",
        promotional_price: 22.95,
        days: ["monday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);
    await promotionRepository.create(promotion);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const products = result.value.menu[0]?.products;
      expect(products![0]!.promotional_price).toBeUndefined();
      expect(products![0]!.promotion?.active).toBe(false);
    }
  });

  it("não deve aplicar promoção em dia diferente", async () => {
    (dateTimeProvider.getCurrentDay as any).mockReturnValue("tuesday");
    (dateTimeProvider.getCurrentTime as any).mockReturnValue("19:00");

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

    const promotion = Promotion.create(
      {
        product_id: 1,
        description: "Happy Hour Segunda",
        promotional_price: 22.95,
        days: ["monday"],
        start_time: "18:00",
        end_time: "20:00",
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    await productRepository.create(product);
    await promotionRepository.create(promotion);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const products = result.value.menu[0]?.products;
      expect(products![0]!.promotional_price).toBeUndefined();
      expect(products![0]!.promotion?.active).toBe(false);
    }
  });

  it("deve retornar produtos sem promoção quando não houver promoção cadastrada", async () => {
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

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const products = result.value.menu[0]?.products;
      expect(products![0]!.promotional_price).toBeUndefined();
      expect(products![0]!.promotion).toBeUndefined();
    }
  });

  it("deve respeitar a ordenação dos produtos", async () => {
    const product1 = Product.create(
      {
        name: "Pizza C",
        price: 45.9,
        category: "Pratos principais",
        visible: true,
        order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("1")
    );

    const product2 = Product.create(
      {
        name: "Pizza A",
        price: 40.0,
        category: "Pratos principais",
        visible: true,
        order: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("2")
    );

    const product3 = Product.create(
      {
        name: "Pizza B",
        price: 42.0,
        category: "Pratos principais",
        visible: true,
        order: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("3")
    );

    await productRepository.create(product1);
    await productRepository.create(product2);
    await productRepository.create(product3);

    const result = await sut.execute();

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      const products = result.value.menu[0]?.products;
      expect(products![0]!.name).toBe("Pizza A");
      expect(products![1]!.name).toBe("Pizza B");
      expect(products![2]!.name).toBe("Pizza C");
    }
  });
});
