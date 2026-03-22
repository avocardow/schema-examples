// experiment_results: Statistical results per variant.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const experiment_results = defineTable({
  experimentId: v.id("experiments"),
  variantId: v.id("experiment_variants"),
  metricId: v.id("metric_definitions"),
  sampleSize: v.number(),
  meanValue: v.optional(v.number()),
  stddev: v.optional(v.number()),
  ciLower: v.optional(v.number()),
  ciUpper: v.optional(v.number()),
  pValue: v.optional(v.number()),
  lift: v.optional(v.number()),
  isSignificant: v.boolean(),
  computedAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_experiment_id_and_variant_id_and_metric_id", ["experimentId", "variantId", "metricId"]);
