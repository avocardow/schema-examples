// campaign_recipients: Links campaigns to their target lists and segments.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaignRecipients = defineTable({
  campaignId: v.id("campaigns"),
  listId: v.optional(v.id("contactLists")),
  segmentId: v.optional(v.id("segments")),
})
  .index("by_campaign_id", ["campaignId"])
  .index("by_list_id", ["listId"])
  .index("by_segment_id", ["segmentId"]);
