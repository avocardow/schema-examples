// product_tag_assignments: Many-to-many mapping between products and tags.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, unique, index } from "drizzle-orm/pg-core";
import { products } from "./products";
import { productTags } from "./product_tags";

export const productTagAssignments = pgTable("product_tag_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => productTags.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_product_tag_assignments_product_tag").on(table.productId, table.tagId),
  index("idx_product_tag_assignments_tag_id").on(table.tagId),
]);
