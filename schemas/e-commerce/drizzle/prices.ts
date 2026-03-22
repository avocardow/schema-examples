// prices: Currency-specific pricing tiers for product variants with optional date ranges.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, timestamp, index } from "drizzle-orm/pg-core";
import { productVariants } from "./product_variants";

export const prices = pgTable("prices", {
  id: uuid("id").primaryKey().defaultRandom(),
  variantId: uuid("variant_id").notNull().references(() => productVariants.id, { onDelete: "cascade" }),
  currency: text("currency").notNull(),
  amount: integer("amount").notNull(),
  compareAtAmount: integer("compare_at_amount"),
  minQuantity: integer("min_quantity"),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_prices_variant_id_currency").on(table.variantId, table.currency),
  index("idx_prices_starts_at_ends_at").on(table.startsAt, table.endsAt),
]);
