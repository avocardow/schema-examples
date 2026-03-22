// product_collections: Curated groupings of products for merchandising and storefront display.
// See README.md for full design rationale.
import { sql } from "drizzle-orm";
import { pgTable, uuid, text, boolean, integer, timestamp, jsonb, index } from "drizzle-orm/pg-core";

export const productCollections = pgTable("product_collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  metadata: jsonb("metadata").default(sql`'{}'`),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_product_collections_is_active_sort_order").on(table.isActive, table.sortOrder),
]);
