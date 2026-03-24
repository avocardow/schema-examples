// activities: logged interactions such as calls, emails, and meetings.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const activities = defineTable({
  type: v.union(v.literal("call"), v.literal("email"), v.literal("meeting")),
  subject: v.string(),
  description: v.optional(v.string()),
  occurredAt: v.number(),
  duration: v.optional(v.number()),
  contactId: v.optional(v.id("contacts")),
  companyId: v.optional(v.id("companies")),
  dealId: v.optional(v.id("deals")),
  ownerId: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_contact_id_and_occurred_at", ["contactId", "occurredAt"])
  .index("by_company_id_and_occurred_at", ["companyId", "occurredAt"])
  .index("by_deal_id_and_occurred_at", ["dealId", "occurredAt"])
  .index("by_owner_id", ["ownerId"])
  .index("by_type", ["type"]);
