import { makeCreatePromotionsController } from "@/infra/factories/promotion/create/make-create-promotion-controller";
import { makeDeletePromotionsController } from "@/infra/factories/promotion/delete/make-delete-promotion-controller";
import { makeListPromotionController } from "@/infra/factories/promotion/list/make-list-promotion-controller";
import { makeUpdatePromotionsController } from "@/infra/factories/promotion/update/make-update-promotion-controller";
import { Router } from "express";

const promotionRoutes = Router();
const createPromotionsController = makeCreatePromotionsController();
const listPromotionsController = makeListPromotionController();
const updatePromotionsController = makeUpdatePromotionsController();
const deletePromotionsController = makeDeletePromotionsController();
// const showPromotionsController = makeShowPromotionsController();

promotionRoutes.post("/", (req, res) =>
  createPromotionsController.create(req, res)
);
promotionRoutes.get("/", (req, res) => listPromotionsController.list(res));
promotionRoutes.put("/:id", (req, res) =>
  updatePromotionsController.update(req, res)
);
promotionRoutes.delete("/:id", (req, res) =>
  deletePromotionsController.delete(req, res)
);
// promotionRoutes.get("/:id", (req, res) => showPromotionsController.show(req, res));

export { promotionRoutes };
