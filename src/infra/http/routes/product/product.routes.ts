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

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos
 *     description: Retorna uma lista com todos os produtos cadastrados
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       404:
 *         description: Nenhum produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No products found"
 */
productRoutes.get("/", (req, res) => listProductsController.list(res));

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Busca um produto por ID
 *     description: Retorna os detalhes de um produto específico
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
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
productRoutes.get("/:id", (req, res) => showProductsController.show(req, res));

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     description: Cadastra um novo produto no sistema
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "Pizza Margherita"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 29.90
 *               category:
 *                 type: string
 *                 enum: ["Entradas", "Pratos principais", "Sobremesas", "Bebidas"]
 *                 example: "Pratos principais"
 *               visible:
 *                 type: boolean
 *                 default: true
 *                 example: true
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
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
 *       409:
 *         description: Produto já existe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product already exists"
 *       500:
 *         description: Erro interno do servidor
 */
productRoutes.post("/", (req, res) =>
  createProductsController.create(req, res)
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     description: Atualiza parcialmente ou totalmente um produto
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "Pizza Margherita Especial"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0.01
 *                 example: 34.90
 *               category:
 *                 type: string
 *                 enum: ["Entradas", "Pratos principais", "Sobremesas", "Bebidas"]
 *                 example: "Pratos principais"
 *               visible:
 *                 type: boolean
 *                 example: false
 *               order:
 *                 type: integer
 *                 minimum: 0
 *                 example: 2
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   $ref: '#/components/schemas/Product'
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
productRoutes.put("/:id", (req, res) =>
  updateProductsController.update(req, res)
);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Remove um produto
 *     description: Deleta permanentemente um produto do sistema
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID do produto
 *     responses:
 *       204:
 *         description: Produto removido com sucesso
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
productRoutes.delete("/:id", (req, res) =>
  deleteProductsController.delete(req, res)
);

export { productRoutes };
