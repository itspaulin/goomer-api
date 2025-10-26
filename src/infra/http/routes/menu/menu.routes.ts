import { makeGetMenuController } from "@/infra/factories/menu/make-get-menu-controller";
import { Router } from "express";

const menuRoutes = Router();
const getMenuController = makeGetMenuController();

menuRoutes.get("/", (req, res) => getMenuController.getMenu(req, res));

export { menuRoutes };
