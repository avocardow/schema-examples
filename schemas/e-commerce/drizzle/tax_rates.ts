// tax_rates: Tax rate definitions by country, region, and product category.
// See README.md for full design rationale.
import { pgTable, uuid, text, numeric, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";

export const taxRates = pgTable("tax_rates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  region: text("region"),
  rate: numeric("rate").notNull(),
  category: text("category"),
  isCompound: boolean("is_compound").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  priority: integer("priority").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_tax_rates_country_region").on(table.country, table.region),
  index("idx_tax_rates_category").on(table.category),
  index("idx_tax_rates_is_active").on(table.isActive),
]);
