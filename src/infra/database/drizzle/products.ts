import {
  pgTable,
  serial,
  varchar,
  decimal,
  pgEnum,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "Entradas",
  "Pratos principais",
  "Sobremesas",
  "Bebidas",
]);

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: categoryEnum("category").notNull(),
  visible: boolean("visible").default(true),
  order: integer("order").default(0),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
