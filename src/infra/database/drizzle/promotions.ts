import {
  pgTable,
  serial,
  varchar,
  decimal,
  integer,
  timestamp,
  text,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id")
    .references(() => products.id)
    .notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  promo_price: decimal("promo_price", { precision: 10, scale: 2 }).notNull(),
  days: text("days").array().notNull(),
  start_time: varchar("start_time", { length: 5 }).notNull(),
  end_time: varchar("end_time", { length: 5 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
