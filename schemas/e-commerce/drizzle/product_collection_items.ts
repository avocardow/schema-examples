// product_collection_items: Junction linking products to curated collections with display ordering.
// See README.md for full design rationale.
import { pgTable, uuid, integer, timestamp, index, unique } from "drizzle-orm/pg-core";
import { productCollections } from "./product_collections";
import { products } from "./products";

export const productCollectionItems = pgTable("product_collection_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  collectionId: uuid("collection_id").notNull().references(() => productCollections.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  sortOrder: integer("sort_order").notNull().default(0),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_product_collection_items_collection_product").on(table.collectionId, table.productId),
  index("idx_product_collection_items_product_id").on(table.productId),
]);
