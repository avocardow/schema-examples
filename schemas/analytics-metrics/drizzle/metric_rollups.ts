// metric_rollups: Pre-computed metric aggregations at various time granularities.
// See README.md for full design rationale.

import {
  pgTable,
  pgEnum,
  uuid,
  numeric,
  bigint,
  jsonb,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { metricDefinitions } from "./metric_definitions";

export const metricGranularityEnum = pgEnum("rollup_granularity", [
  "hourly",
  "daily",
  "weekly",
  "monthly",
]);

export const metricRollups = pgTable(
  "metric_rollups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    metricId: uuid("metric_id").notNull().references(() => metricDefinitions.id, { onDelete: "cascade" }),
    granularity: metricGranularityEnum("granularity").notNull(),
    periodStart: timestamp("period_start", { withTimezone: true }).notNull(),
    periodEnd: timestamp("period_end", { withTimezone: true }).notNull(),
    value: numeric("value").notNull(),
    count: bigint("count", { mode: "number" }).notNull().default(0),
    dimensions: jsonb("dimensions"),
    computedAt: timestamp("computed_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_metric_rollups_metric_gran_period_dims").on(table.metricId, table.granularity, table.periodStart, table.dimensions),
    // index(metric_id, granularity, period_start) omitted — leading columns of the unique index above.
    index("idx_metric_rollups_period_start").on(table.periodStart),
  ]
);
