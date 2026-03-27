// clicks: Records each click on an affiliate link with device, geo, and uniqueness info.
// See README.md for full design rationale.
import { defineTable } from "convex/server";
import { v } from "convex/values";

export const clicks = defineTable({
  affiliateLinkId: v.id("affiliate_links"),
  clickId: v.string(),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string()),
  refererUrl: v.optional(v.string()),
  landingUrl: v.optional(v.string()),
  country: v.optional(v.string()),
  deviceType: v.optional(v.string()),
  isUnique: v.boolean(),
})
  .index("by_affiliate_link_id_and_creation_time", ["affiliateLinkId", "_creationTime"])
  .index("by_creation_time", ["_creationTime"])
  .index("by_click_id", ["clickId"]);
