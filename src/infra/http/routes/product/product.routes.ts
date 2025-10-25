import { makeProductsController } from "@/infra/factories/product/make-products-controller";
import { Router } from "express";

const productRoutes = Router();
const productsController = makeProductsController();

productRoutes.post("/", (req, res) => productsController.create(req, res));
// productRoutes.get("/", (req, res) => productsController.list(req, res));
// productRoutes.get("/:id", (req, res) => productsController.show(req, res));
// productRoutes.put("/:id", (req, res) => productsController.update(req, res));
// productRoutes.delete("/:id", (req, res) => productsController.delete(req, res));

export { productRoutes };
