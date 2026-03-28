// chart_entries: individual track positions within a chart on a given date.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const chart_entries = defineTable({
  chartId: v.id("charts"),
  trackId: v.id("tracks"),
  position: v.number(),
  previousPosition: v.optional(v.number()),
  peakPosition: v.number(),
  weeksOnChart: v.number(),
  chartDate: v.string(),
})
  .index("by_chart_id_chart_date_position", ["chartId", "chartDate", "position"])
  .index("by_track_id_chart_date", ["trackId", "chartDate"]);
