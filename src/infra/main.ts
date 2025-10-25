import express from "express";
import { env } from "./config/env";
import { DrizzleProductRepository } from "./database/drizzle/repositories/drizzle-product-repository";
import { CreateProductUseCase } from "@/domain/application/use-cases/create-product.use-case";
import { ProductsController } from "./http/controllers/create-product.controller";

const app = express();
const port = env.PORT;

app.use(express.json());

const productRepository = new DrizzleProductRepository();
const createProductUseCase = new CreateProductUseCase(productRepository);
const productsController = new ProductsController(createProductUseCase);

app.post("/products", (req, res) => productsController.create(req, res));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
