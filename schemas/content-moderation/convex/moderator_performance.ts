// moderator_performance: Pre-aggregated moderator performance metrics.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const moderator_performance = defineTable({
  moderatorId: v.id("users"), // The moderator being measured. Cascade: if moderator is deleted, their metrics are removed.

  periodStart: v.number(), // Start of the measurement period (Unix epoch ms).
  periodEnd: v.number(), // End of the measurement period (Unix epoch ms).

  itemsReviewed: v.number(), // Total queue items reviewed during this period.
  itemsActioned: v.number(), // Items where enforcement action was taken (vs approved/dismissed).
  averageReviewTimeSeconds: v.number(), // Mean time from assignment to resolution, in seconds.
  appealsOverturned: v.number(), // Actions by this moderator that were overturned on appeal.
  accuracyScore: v.number(), // 1.0 - (appealsOverturned / itemsActioned), clamped to 0-1.

  computedAt: v.number(), // When this rollup was last computed (Unix epoch ms).
})
  .index("by_moderator_id_period", ["moderatorId", "periodStart", "periodEnd"])
  .index("by_moderator_id", ["moderatorId"])
  .index("by_period", ["periodStart", "periodEnd"]);
