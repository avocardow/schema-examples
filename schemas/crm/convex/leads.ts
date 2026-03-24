// leads: inbound prospects before conversion to contacts.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const leads = defineTable({
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
  phone: v.optional(v.string()),
  companyName: v.optional(v.string()),
  title: v.optional(v.string()),
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
  status: v.union(
    v.literal("new"),
    v.literal("contacted"),
    v.literal("qualified"),
    v.literal("unqualified"),
    v.literal("converted")
  ),
  convertedAt: v.optional(v.number()),
  convertedContactId: v.optional(v.id("contacts")),
  ownerId: v.optional(v.id("users")),
  notes: v.optional(v.string()),
  updatedAt: v.number(),
})
  .index("by_email", ["email"])
  .index("by_status", ["status"])
  .index("by_owner_id", ["ownerId"])
  .index("by_source", ["source"]);
