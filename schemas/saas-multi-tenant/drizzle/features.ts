// features: Feature catalog for plan-based entitlements and usage metering.
// See README.md for full schema documentation.

import { pgTable, pgEnum, uuid, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

export const featureTypeEnum = pgEnum("feature_type", ["boolean", "limit", "metered"]);

export const features = pgTable(
  "features",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").unique().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    featureType: featureTypeEnum("feature_type").notNull(),
    unit: text("unit"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_features_feature_type").on(table.featureType),
    index("idx_features_is_enabled").on(table.isEnabled),
  ]
);
