// shipping_profiles: Reusable shipping configuration templates for product fulfillment strategies.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, timestamp, index } from "drizzle-orm/pg-core";

export const shippingProfileTypeEnum = pgEnum("shipping_profile_type", [
  "default",
  "digital",
  "custom",
]);

export const shippingProfiles = pgTable("shipping_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: shippingProfileTypeEnum("type").notNull().default("default"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}, (table) => [
  index("idx_shipping_profiles_type").on(table.type),
]);
