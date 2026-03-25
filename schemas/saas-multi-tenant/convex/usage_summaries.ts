// usage_summaries: Aggregated usage metrics per organization, feature, and period.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const usage_summaries = defineTable({
  organizationId: v.id("organizations"),
  featureId: v.id("features"),
  periodStart: v.number(),
  periodEnd: v.number(),
  totalQuantity: v.number(),
  eventCount: v.number(),
  updatedAt: v.number(),
})
  .index("by_organization_id_and_feature_id_and_period_start", [
    "organizationId",
    "featureId",
    "periodStart",
  ])
  .index("by_period_start_and_period_end", ["periodStart", "periodEnd"]);
