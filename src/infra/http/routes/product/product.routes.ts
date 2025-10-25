import { makeCreateProductsController } from "@/infra/factories/product/create/make-create-products-controller";
import { makeDeleteProductsController } from "@/infra/factories/product/delete/make-delete-products-controller";
import { makeListProductsController } from "@/infra/factories/product/list/make-list-products-controller";
import { makeShowProductsController } from "@/infra/factories/product/show/make-show-products-controller";
import { makeUpdateProductsController } from "@/infra/factories/product/update/make-update-products-controller";
import { Router } from "express";

const productRoutes = Router();
const createProductsController = makeCreateProductsController();
const listProductsController = makeListProductsController();
const updateProductsController = makeUpdateProductsController();
const deleteProductsController = makeDeleteProductsController();
const showProductsController = makeShowProductsController();

productRoutes.post("/", (req, res) =>
  createProductsController.create(req, res)
);
productRoutes.get("/", (req, res) => listProductsController.list(res));
productRoutes.put("/:id", (req, res) =>
  updateProductsController.update(req, res)
);
productRoutes.delete("/:id", (req, res) =>
  deleteProductsController.delete(req, res)
);
productRoutes.get("/:id", (req, res) => showProductsController.show(req, res));

export { productRoutes };
