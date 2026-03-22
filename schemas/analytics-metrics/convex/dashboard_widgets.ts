// dashboard_widgets: Widgets within dashboards.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const dashboard_widgets = defineTable({
  dashboardId: v.id("dashboards"),
  metricId: v.optional(v.id("metric_definitions")),
  title: v.optional(v.string()),
  chartType: v.union(
    v.literal("line"),
    v.literal("bar"),
    v.literal("area"),
    v.literal("pie"),
    v.literal("number"),
    v.literal("table"),
    v.literal("funnel"),
    v.literal("map"),
  ),
  config: v.optional(v.any()),
  positionX: v.number(),
  positionY: v.number(),
  width: v.number(),
  height: v.number(),
  updatedAt: v.number(),
})
  .index("by_dashboard_id", ["dashboardId"])
  .index("by_metric_id", ["metricId"]);
