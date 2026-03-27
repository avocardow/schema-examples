// member_activities: Log of member actions that may trigger earning rules.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const memberActivities = defineTable({
  memberId: v.id("loyalty_members"),
  activityType: v.string(),
  description: v.optional(v.string()),
  source: v.optional(v.string()),
  referenceType: v.optional(v.string()),
  referenceId: v.optional(v.string()),
  monetaryValue: v.optional(v.number()),
  currency: v.optional(v.string()),
  pointsAwarded: v.optional(v.number()),
  transactionId: v.optional(v.id("points_transactions")),
  metadata: v.optional(v.any()),
})
  .index("by_member_id_and_creation_time", ["memberId", "_creationTime"])
  .index("by_activity_type", ["activityType"])
  .index("by_reference", ["referenceType", "referenceId"])
  .index("by_transaction_id", ["transactionId"]);
