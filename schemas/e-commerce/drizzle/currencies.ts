// currencies: Supported currencies with exchange rates for multi-currency pricing.
// See README.md for full design rationale.
import { pgTable, uuid, text, boolean, integer, numeric, timestamp, index } from "drizzle-orm/pg-core";

export const currencies = pgTable("currencies", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: text("code").unique().notNull(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  decimalPlaces: integer("decimal_places").notNull().default(2),
  exchangeRate: numeric("exchange_rate").notNull().default("1.0"),
  isBase: boolean("is_base").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_currencies_is_active").on(table.isActive),
]);
