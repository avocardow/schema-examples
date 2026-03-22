// product_images: Images associated with products or specific variants.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { products } from "./products";
import { productVariants } from "./product_variants";

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  url: text("url").notNull(),
  altText: text("alt_text"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_product_images_product_id_sort_order").on(table.productId, table.sortOrder),
  index("idx_product_images_variant_id").on(table.variantId),
]);
