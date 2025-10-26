import { Router } from "express";
import { productRoutes } from "./product/product.routes";
import { promotionRoutes } from "./promotion/promotion.routes";
import { menuRoutes } from "./menu/menu.routes";

const routes = Router();

routes.use("/products", productRoutes);
routes.use("/promotions", promotionRoutes);
routes.use("/menu", menuRoutes);

// routes.use("/orders", orderRoutes);

export { routes };
