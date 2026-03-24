// companies: organizations tracked in the CRM with address and ownership details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const companies = defineTable({
  name: v.string(),
  domain: v.optional(v.string()),
  industry: v.optional(v.string()),
  employeeCount: v.optional(v.number()),
  annualRevenue: v.optional(v.number()),
  phone: v.optional(v.string()),
  addressStreet: v.optional(v.string()),
  addressCity: v.optional(v.string()),
  addressState: v.optional(v.string()),
  addressCountry: v.optional(v.string()),
  addressZip: v.optional(v.string()),
  website: v.optional(v.string()),
  description: v.optional(v.string()),
  ownerId: v.optional(v.id("users")),
  updatedAt: v.number(),
})
  .index("by_domain", ["domain"])
  .index("by_owner_id", ["ownerId"])
  .index("by_industry", ["industry"]);
