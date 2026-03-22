// shipping_methods: Delivery options with pricing, weight limits, and estimated transit times per shipping zone.
// See README.md for full design rationale.
import { pgTable, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { shippingZones } from "./shipping_zones";
import { shippingProfiles } from "./shipping_profiles";

export const shippingMethods = pgTable("shipping_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  zoneId: uuid("zone_id").notNull().references(() => shippingZones.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").references(() => shippingProfiles.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  currency: text("currency").notNull(),
  minDeliveryDays: integer("min_delivery_days"),
  maxDeliveryDays: integer("max_delivery_days"),
  minOrderAmount: integer("min_order_amount"),
  maxWeightGrams: integer("max_weight_grams"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("idx_shipping_methods_zone_id_is_active_sort_order").on(table.zoneId, table.isActive, table.sortOrder),
  index("idx_shipping_methods_profile_id").on(table.profileId),
]);
