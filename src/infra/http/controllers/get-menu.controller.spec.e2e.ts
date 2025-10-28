import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import request from "supertest";
import express, { Express } from "express";
import { InMemoryProductRepository } from "@/infra/database/test/repositories/in-memory-product-repository";
import { InMemoryPromotionRepository } from "@/infra/database/test/repositories/in-memory-promotion-repository";
import { GetMenuUseCase } from "@/domain/application/use-cases/get-menu.use-case";
import { GetMenuController } from "@/infra/http/controllers/get-menu.controller";
import { Product } from "@/domain/enterprise/entities/product";
import { Promotion } from "@/domain/enterprise/entities/promotion";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { MockDateTimeProvider } from "@test/utils/mock-datetime-provider";

describe("GetMenuController (E2E)", () => {
  let productRepository: InMemoryProductRepository;
  let promotionRepository: InMemoryPromotionRepository;
  let dateTimeProvider: MockDateTimeProvider;
  let app: Express;

  beforeEach(async () => {
    productRepository = new InMemoryProductRepository();
    promotionRepository = new InMemoryPromotionRepository();
    dateTimeProvider = new MockDateTimeProvider();

    dateTimeProvider.getCurrentDay.mockReturnValue("segunda-feira");
    dateTimeProvider.getCurrentTime.mockReturnValue("19:00");

    const useCase = new GetMenuUseCase(
      productRepository,
      promotionRepository,
      dateTimeProvider
    );
    const controller = new GetMenuController(useCase);

    app = express();
    app.use(express.json());
    app.get("/menu", (req, res) => controller.getMenu(req, res));

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

    const escondido = Product.create(
      {
        name: "Produto Escondido",
        price: 10,
        category: "Bebidas",
        visible: false,
        order: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      new UniqueEntityId("3")
    );

    await productRepository.create(pizza);
    await productRepository.create(coca);
    await productRepository.create(escondido);

    const promoPizza = Promotion.create(
      {
        product_id: 1,
        description: "Segunda: 30% off na pizza",
        promotional_price: 32.13,
        days: ["segunda-feira"],
        start_time: "18:00",
        end_time: "22:00",
        created_at: new Date(),
      },
      new UniqueEntityId("p1")
    );

    const promoCoca = Promotion.create(
      {
        product_id: 2,
        description: "Terça: Coca grátis",
        promotional_price: 0,
        days: ["terça-feira"],
        start_time: "11:00",
        end_time: "15:00",
        created_at: new Date(),
      },
      new UniqueEntityId("p2")
    );

    await promotionRepository.create(promoPizza);
    await promotionRepository.create(promoCoca);
  });

  afterEach(() => {
    vi.clearAllMocks();
    productRepository.items = [];
    promotionRepository.items = [];
  });

  it("deve retornar o menu agrupado por categoria com promoção ativa", async () => {
    dateTimeProvider.getCurrentDay.mockReturnValue("segunda-feira");
    dateTimeProvider.getCurrentTime.mockReturnValue("19:00");

    const response = await request(app).get("/menu");

    expect(response.status).toBe(200);
    const { menu } = response.body;

    const pratos = menu.find(
      (cat: any) => cat.category === "Pratos principais"
    );
    const bebidas = menu.find((cat: any) => cat.category === "Bebidas");

    expect(pratos).toBeDefined();
    expect(pratos!.products).toHaveLength(1);
    expect(pratos!.products[0]).toMatchObject({
      id: "1",
      name: "Pizza Margherita",
      price: 45.9,
      promotional_price: 32.13,
      promotion: {
        description: "Segunda: 30% off na pizza",
        active: true,
      },
    });

    expect(bebidas).toBeDefined();
    expect(bebidas!.products).toHaveLength(1);
    expect(bebidas!.products[0]).toMatchObject({
      id: "2",
      name: "Coca-Cola",
      price: 5.0,
      promotion: {
        description: "Terça: Coca grátis",
        active: false,
      },
    });
    // Verifica que promotional_price não está presente
    expect(bebidas!.products[0].promotional_price).toBeUndefined();
  });

  it("deve retornar menu sem promoção ativa se fora do horário/dia", async () => {
    dateTimeProvider.getCurrentDay.mockReturnValue("domingo");
    dateTimeProvider.getCurrentTime.mockReturnValue("10:00");

    const response = await request(app).get("/menu");

    expect(response.status).toBe(200);
    const { menu } = response.body;

    const pratos = menu.find(
      (cat: any) => cat.category === "Pratos principais"
    );
    expect(pratos!.products[0].promotional_price).toBeUndefined();
    expect(pratos!.products[0].promotion?.active).toBe(false);

    const bebidas = menu.find((cat: any) => cat.category === "Bebidas");
    expect(bebidas!.products[0].promotional_price).toBeUndefined();
    expect(bebidas!.products[0].promotion?.active).toBe(false);
  });

  it("deve ignorar produtos com visible: false", async () => {
    dateTimeProvider.getCurrentDay.mockReturnValue("segunda-feira");
    dateTimeProvider.getCurrentTime.mockReturnValue("19:00");

    const response = await request(app).get("/menu");

    const { menu } = response.body;

    const bebidas = menu.find((cat: any) => cat.category === "Bebidas");
    expect(bebidas!.products).toHaveLength(1);
    expect(bebidas!.products[0].name).toBe("Coca-Cola");
  });

  it("deve ordenar categorias e itens corretamente", async () => {
    dateTimeProvider.getCurrentDay.mockReturnValue("segunda-feira");
    dateTimeProvider.getCurrentTime.mockReturnValue("19:00");

    const response = await request(app).get("/menu");

    const { menu } = response.body;

    expect(menu).toHaveLength(2);
    expect(menu[0].category).toBe("Pratos principais");
    expect(menu[1].category).toBe("Bebidas");

    expect(menu[0].products[0]).toMatchObject({
      id: "1",
      name: "Pizza Margherita",
      order: 1,
    });
    expect(menu[1].products[0]).toMatchObject({
      id: "2",
      name: "Coca-Cola",
      order: 2,
    });
  });

  it("deve usar timezone corretamente", async () => {
    dateTimeProvider.getCurrentDay.mockImplementation((tz) => {
      expect(tz).toBe("America/Manaus");
      return "segunda-feira";
    });

    dateTimeProvider.getCurrentTime.mockImplementation((tz) => {
      expect(tz).toBe("America/Manaus");
      return "19:00";
    });

    const response = await request(app)
      .get("/menu")
      .query({ timezone: "America/Manaus" });

    expect(response.status).toBe(200);
    const { menu, metadata } = response.body;

    expect(metadata.timezone).toBe("America/Manaus");
    expect(metadata.current_day).toBeDefined();
    expect(metadata.current_time).toBeDefined();
  });
});
