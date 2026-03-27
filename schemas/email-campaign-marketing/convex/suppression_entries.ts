// suppression_entries: Global suppression list preventing sends to bounced or complained addresses.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const suppressionEntries = defineTable({
  email: v.string(),
  reason: v.union(
    v.literal("hard_bounce"),
    v.literal("complaint"),
    v.literal("manual"),
    v.literal("list_unsubscribe")
  ),
  sourceCampaignId: v.optional(v.id("campaigns")),
  createdBy: v.optional(v.id("users")),
})
  .index("by_email", ["email"])
  .index("by_reason", ["reason"]);
