// notes: free-form text notes attached to contacts, companies, deals, or leads.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const notes = defineTable({
  content: v.string(),
  contactId: v.optional(v.id("contacts")),
  companyId: v.optional(v.id("companies")),
  dealId: v.optional(v.id("deals")),
  leadId: v.optional(v.id("leads")),
  createdBy: v.id("users"),
  updatedAt: v.number(),
})
  .index("by_contact_id", ["contactId"])
  .index("by_company_id", ["companyId"])
  .index("by_deal_id", ["dealId"])
  .index("by_lead_id", ["leadId"])
  .index("by_created_by", ["createdBy"]);
