// fulfillment_providers: External and internal providers responsible for shipping and delivering orders.
// See README.md for full design rationale.

import { pgTable, pgEnum, uuid, text, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";

export const fulfillmentProviderTypeEnum = pgEnum("fulfillment_provider_type", [
  "manual",
  "flat_rate",
  "carrier_calculated",
  "third_party",
]);

export const fulfillmentProviders = pgTable("fulfillment_providers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  code: text("code").unique().notNull(),
  type: fulfillmentProviderTypeEnum("type").notNull(),
  config: jsonb("config"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}, (table) => [
  index("idx_fulfillment_providers_is_active").on(table.isActive),
]);
