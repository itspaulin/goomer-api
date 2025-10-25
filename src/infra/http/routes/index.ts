import { Router } from "express";
import { productRoutes } from "./product/product.routes";

const routes = Router();

routes.use("/products", productRoutes);
// routes.use("/categories", categoryRoutes);
// routes.use("/orders", orderRoutes);

export { routes };
