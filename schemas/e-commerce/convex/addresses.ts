// addresses: User shipping and billing addresses with default selection.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const addresses = defineTable({
  userId: v.id("users"),
  label: v.optional(v.string()),
  firstName: v.string(),
  lastName: v.string(),
  company: v.optional(v.string()),
  addressLine1: v.string(),
  addressLine2: v.optional(v.string()),
  city: v.string(),
  region: v.optional(v.string()),
  postalCode: v.optional(v.string()),
  country: v.string(),
  phone: v.optional(v.string()),
  isDefaultShipping: v.boolean(),
  isDefaultBilling: v.boolean(),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"]);
