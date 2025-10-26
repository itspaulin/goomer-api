ALTER TABLE "promotions" DROP CONSTRAINT "promotions_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "description" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "promotions" ALTER COLUMN "days" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "promotional_price" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "promotions" DROP COLUMN "product_id";--> statement-breakpoint
ALTER TABLE "promotions" DROP COLUMN "promo_price";