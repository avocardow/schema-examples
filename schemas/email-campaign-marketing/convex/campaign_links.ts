// campaign_links: Tracked URLs within campaigns for click analytics.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const campaignLinks = defineTable({
  campaignId: v.id("campaigns"),
  originalUrl: v.string(),
  position: v.optional(v.number()),
})
  .index("by_campaign_id_original_url", ["campaignId", "originalUrl"]);
