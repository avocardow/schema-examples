// contacts: individual people tracked in the CRM with lifecycle and ownership.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contacts = defineTable({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  title: v.optional(v.string()),
  lifecycleStage: v.union(
    v.literal("subscriber"),
    v.literal("lead"),
    v.literal("qualified"),
    v.literal("opportunity"),
    v.literal("customer"),
    v.literal("evangelist"),
    v.literal("other")
  ),
  source: v.optional(
    v.union(
      v.literal("web"),
      v.literal("referral"),
      v.literal("organic"),
      v.literal("paid"),
      v.literal("social"),
      v.literal("event"),
      v.literal("cold_outreach"),
      v.literal("other")
    )
  ),
  ownerId: v.optional(v.id("users")),
  avatarUrl: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_owner_id", ["ownerId"])
  .index("by_lifecycle_stage", ["lifecycleStage"]);
