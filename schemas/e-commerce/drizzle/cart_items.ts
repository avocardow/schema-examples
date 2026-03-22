// cart_items: Line items linking a cart to specific product variants with quantities.
// See README.md for full design rationale.
import { pgTable, uuid, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { carts } from "./carts";
import { productVariants } from "./product_variants";

export const cartItems = pgTable("cart_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  cartId: uuid("cart_id").notNull().references(() => carts.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("idx_cart_items_cart_id_variant_id").on(table.cartId, table.variantId),
]);
