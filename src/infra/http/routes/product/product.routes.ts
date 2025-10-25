import { makeCreateProductsController } from "@/infra/factories/product/make-products-controller";
import { makeListProductsController } from "@/infra/factories/product/make-list-products-controller";
import { Router } from "express";

const productRoutes = Router();
const createProductsController = makeCreateProductsController();
const listProductsController = makeListProductsController();

productRoutes.post("/", (req, res) =>
  createProductsController.create(req, res)
);
productRoutes.get("/", (req, res) => listProductsController.list(res));
// productRoutes.get("/:id", (req, res) => productsController.show(req, res));
// productRoutes.put("/:id", (req, res) => productsController.update(req, res));
// productRoutes.delete("/:id", (req, res) => productsController.delete(req, res));

export { productRoutes };
