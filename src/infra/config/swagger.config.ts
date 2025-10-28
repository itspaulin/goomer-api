// swagger.config.ts
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "@/infra/config/env";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Goomer API",
      version: "1.0.0",
      description: "API para gerenciamento de produtos, promoções e cardápios",
      contact: {
        name: "Suporte",
        email: "suporte@goomer.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: "Servidor de desenvolvimento",
      },
    ],
    tags: [
      {
        name: "Products",
        description: "Endpoints para gerenciamento de produtos",
      },
      {
        name: "Promotions",
        description: "Endpoints para gerenciamento de promoções",
      },
      {
        name: "Menu",
        description: "Endpoints para gerenciamento de cardápios",
      },
    ],
    components: {
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Mensagem de erro",
            },
            error: {
              type: "string",
              description: "Tipo do erro",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            name: {
              type: "string",
              example: "Pizza Margherita",
            },
            price: {
              type: "number",
              format: "float",
              example: 29.9,
            },
            category: {
              type: "string",
              enum: ["Entradas", "Pratos principais", "Sobremesas", "Bebidas"],
              example: "Pratos principais",
            },
            visible: {
              type: "boolean",
              example: true,
            },
            order: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-15T10:30:00Z",
            },
          },
        },
        Promotion: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            productId: {
              type: "string",
              format: "uuid",
            },
            description: {
              type: "string",
            },
            discountPrice: {
              type: "number",
              format: "float",
            },
            startDate: {
              type: "string",
              format: "date-time",
            },
            endDate: {
              type: "string",
              format: "date-time",
            },
            daysOfWeek: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ],
              },
            },
          },
        },
      },
    },
  },
  // IMPORTANTE: Use caminhos absolutos ou relativos à raiz do projeto
  apis: [
    "./src/infra/http/routes/**/*.routes.ts",
    "./src/infra/http/routes/**/*.ts",
    "./src/infra/http/routes/index.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
