import { makeGetMenuController } from "@/infra/factories/menu/make-get-menu-controller";
import { Router } from "express";

const menuRoutes = Router();
const getMenuController = makeGetMenuController();

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Retorna o cardápio completo
 *     description: Obtém o cardápio com produtos e promoções ativas baseado no timezone informado
 *     tags: [Menu]
 *     parameters:
 *       - in: query
 *         name: timezone
 *         schema:
 *           type: string
 *         required: false
 *         description: Timezone para filtrar promoções ativas (ex. America/Sao_Paulo)
 *         example: "America/Sao_Paulo"
 *     responses:
 *       200:
 *         description: Cardápio retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 menu:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       category:
 *                         type: string
 *                         example: "Pratos principais"
 *                       products:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                               example: "123e4567-e89b-12d3-a456-426614174000"
 *                             name:
 *                               type: string
 *                               example: "Pizza Margherita"
 *                             price:
 *                               type: number
 *                               format: float
 *                               example: 29.90
 *                             promotional_price:
 *                               type: number
 *                               format: float
 *                               nullable: true
 *                               example: 19.90
 *                             promotion_description:
 *                               type: string
 *                               nullable: true
 *                               example: "Promoção de fim de semana"
 *                             visible:
 *                               type: boolean
 *                               example: true
 *                 metadata:
 *                   type: object
 *                   properties:
 *                     timezone:
 *                       type: string
 *                       example: "America/Sao_Paulo"
 *                     current_time:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-15T19:30:00-03:00"
 *                     active_promotions:
 *                       type: integer
 *                       example: 5
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
menuRoutes.get("/", (req, res) => getMenuController.getMenu(req, res));

export { menuRoutes };
