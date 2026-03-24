// deal_contacts: many-to-many join between deals and contacts with stakeholder roles.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const dealContacts = defineTable({
  dealId: v.id("deals"),
  contactId: v.id("contacts"),
  role: v.union(
    v.literal("decision_maker"),
    v.literal("champion"),
    v.literal("influencer"),
    v.literal("end_user"),
    v.literal("other")
  ),
})
  .index("by_deal_id_and_contact_id", ["dealId", "contactId"])
  .index("by_contact_id", ["contactId"]);
