// metric_rollups: Pre-aggregated metric values.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const metric_rollups = defineTable({
  metricId: v.id("metric_definitions"),
  granularity: v.union(
    v.literal("hourly"),
    v.literal("daily"),
    v.literal("weekly"),
    v.literal("monthly"),
  ),
  periodStart: v.number(),
  periodEnd: v.number(),
  value: v.number(),
  count: v.number(),
  dimensions: v.optional(v.any()),
  computedAt: v.number(),
})
  .index("by_metric_id_and_granularity_and_period_start", ["metricId", "granularity", "periodStart"])
  .index("by_period_start", ["periodStart"]);
