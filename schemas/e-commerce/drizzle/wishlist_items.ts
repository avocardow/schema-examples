// wishlist_items: Individual variant entries saved to a customer wishlist.
// See README.md for full design rationale.
import { pgTable, uuid, timestamp, unique } from "drizzle-orm/pg-core";
import { wishlists } from "./wishlists";
import { productVariants } from "./product_variants";

export const wishlistItems = pgTable("wishlist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  wishlistId: uuid("wishlist_id").notNull().references(() => wishlists.id, { onDelete: "cascade" }),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("uq_wishlist_items_wishlist_variant").on(table.wishlistId, table.variantId),
]);
