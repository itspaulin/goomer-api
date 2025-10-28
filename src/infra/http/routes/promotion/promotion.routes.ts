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

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Lista todas as promoções
 *     description: Retorna uma lista com todas as promoções cadastradas
 *     tags: [Promotions]
 *     responses:
 *       200:
 *         description: Lista de promoções retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 promotions:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promotion'
 *       404:
 *         description: Nenhuma promoção encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No promotions found"
 */
promotionRoutes.get("/", (req, res) => listPromotionsController.list(res));

/**
 * @swagger
 * /promotions:
 *   post:
 *     summary: Cria uma nova promoção
 *     description: Cadastra uma nova promoção vinculada a um produto
 *     tags: [Promotions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - promotional_price
 *               - days
 *               - start_time
 *               - end_time
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               description:
 *                 type: string
 *                 example: "Promoção de fim de semana"
 *               promotional_price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 19.90
 *               days:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 6
 *                 example: [5, 6]
 *                 description: "Dias da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "18:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "22:00"
 *     responses:
 *       201:
 *         description: Promoção criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 promotion:
 *                   $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Dados inválidos ou preço promocional maior que o preço do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Promotional price must be less than product price"
 *       404:
 *         description: Produto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Erro interno do servidor
 */
promotionRoutes.post("/", (req, res) =>
  createPromotionsController.create(req, res)
);

/**
 * @swagger
 * /promotions/{id}:
 *   put:
 *     summary: Atualiza uma promoção existente
 *     description: Atualiza parcialmente ou totalmente uma promoção
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da promoção
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               description:
 *                 type: string
 *                 example: "Promoção atualizada"
 *               promotional_price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 24.90
 *               days:
 *                 type: array
 *                 items:
 *                   type: integer
 *                   minimum: 0
 *                   maximum: 6
 *                 example: [0, 6]
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "17:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "23:00"
 *     responses:
 *       200:
 *         description: Promoção atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 promotion:
 *                   $ref: '#/components/schemas/Promotion'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid data"
 *       404:
 *         description: Promoção não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Promotion not found"
 *       500:
 *         description: Erro interno do servidor
 */
promotionRoutes.put("/:id", (req, res) =>
  updatePromotionsController.update(req, res)
);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Remove uma promoção
 *     description: Deleta permanentemente uma promoção do sistema
 *     tags: [Promotions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID da promoção
 *     responses:
 *       200:
 *         description: Promoção removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Promotion deleted successfully"
 *       404:
 *         description: Promoção não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Promotion not found"
 *       500:
 *         description: Erro interno do servidor
 */
promotionRoutes.delete("/:id", (req, res) =>
  deletePromotionsController.delete(req, res)
);

export { promotionRoutes };
