// tasks: actionable items assigned to users, leads, or deals with priority and status tracking.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const tasks = defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  dueDate: v.optional(v.string()),
  priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  status: v.union(
    v.literal("todo"),
    v.literal("in_progress"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  completedAt: v.optional(v.number()),
  contactId: v.optional(v.id("contacts")),
  companyId: v.optional(v.id("companies")),
  dealId: v.optional(v.id("deals")),
  leadId: v.optional(v.id("leads")),
  ownerId: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_owner_id_and_status", ["ownerId", "status"])
  .index("by_due_date", ["dueDate"])
  .index("by_contact_id", ["contactId"])
  .index("by_deal_id", ["dealId"])
  .index("by_company_id", ["companyId"])
  .index("by_lead_id", ["leadId"]);
