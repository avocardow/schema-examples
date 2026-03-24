// contact_companies: many-to-many join between contacts and companies with role info.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const contactCompanies = defineTable({
  contactId: v.id("contacts"),
  companyId: v.id("companies"),
  role: v.optional(v.string()),
  isPrimary: v.boolean(),
})
  .index("by_contact_id_and_company_id", ["contactId", "companyId"])
  .index("by_company_id", ["companyId"]);
