// shipping_zones: Geographic zones that define where products can be shipped.
// See README.md for full design rationale.
import { pgTable, uuid, text, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const shippingZones = pgTable("shipping_zones", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  countries: text("countries").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_shipping_zones_is_active").on(table.isActive),
]);
