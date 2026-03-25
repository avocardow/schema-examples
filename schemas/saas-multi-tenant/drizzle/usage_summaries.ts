// usage_summaries: Aggregated feature usage per organization and billing period.
// See README.md for full schema documentation.

import { pgTable, uuid, timestamp, bigint, integer, unique, index } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { features } from "./features";

export const usageSummaries = pgTable(
  "usage_summaries",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    featureId: uuid("feature_id")
      .notNull()
      .references(() => features.id, { onDelete: "cascade" }),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    totalQuantity: bigint("total_quantity", { mode: "number" }).notNull().default(0),
    eventCount: integer("event_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().$onUpdate(() => new Date()),
  },
  (table) => [
    unique("uq_usage_summaries_org_feature_period").on(table.organizationId, table.featureId, table.periodStart),
    index("idx_usage_summaries_period_start_end").on(table.periodStart, table.periodEnd),
  ]
);
