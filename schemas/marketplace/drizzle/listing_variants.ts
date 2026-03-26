// listing_variants: Per-variant pricing, stock, and activation for marketplace listings.
// See README.md for full design rationale.

import {
  pgTable,
  uuid,
  integer,
  text,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { listings } from "./listings";
import { productVariants } from "../../e-commerce/drizzle/product_variants";

export const listingVariants = pgTable(
  "listing_variants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    variantId: uuid("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "cascade" }),
    price: integer("price").notNull(),
    currency: text("currency").notNull(),
    salePrice: integer("sale_price"),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    unique("idx_listing_variants_listing_id_variant_id").on(
      table.listingId,
      table.variantId
    ),
    index("idx_listing_variants_variant_id_is_active").on(
      table.variantId,
      table.isActive
    ),
  ]
);
