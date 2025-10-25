export const PRODUCT_CATEGORIES = [
  "Entradas",
  "Pratos principais",
  "Sobremesas",
  "Bebidas",
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
