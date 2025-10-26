import {
  pgTable,
  serial,
  varchar,
  decimal,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { products } from "./products";

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  product_id: integer("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  description: text("description").notNull(),
  promotional_price: decimal("promotional_price", {
    precision: 10,
    scale: 2,
  }).notNull(),
  days: text("days").notNull(),
  start_time: varchar("start_time", { length: 5 }).notNull(),
  end_time: varchar("end_time", { length: 5 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});
